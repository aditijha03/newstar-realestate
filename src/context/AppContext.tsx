import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Property, MockEnquiry } from '@/utils/constants';

// Set up Axios defaults
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || '';

interface AppContextValue {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  properties: Property[];
  enquiries: MockEnquiry[];
  isLoading: boolean;
  adminToken: string | null;
  adminUser: { id: string; name: string; email: string; role: string } | null;
  isAdminLoggedIn: boolean;
  
  // Property Actions
  addProperty: (property: Omit<Property, 'id'>) => Promise<boolean>;
  updateProperty: (property: Property) => Promise<boolean>;
  deleteProperty: (id: number | string) => Promise<boolean>;
  
  // Enquiry Actions
  addEnquiry: (enquiry: Omit<MockEnquiry, 'id' | 'date' | 'status'>) => Promise<boolean>;
  updateEnquiryStatus: (id: number | string, status: 'New' | 'Contacted' | 'Closed') => Promise<boolean>;
  
  // Auth Actions
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AppContext = createContext<AppContextValue>({
  isMobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  properties: [],
  enquiries: [],
  isLoading: false,
  adminToken: null,
  adminUser: null,
  isAdminLoggedIn: false,
  addProperty: async () => false,
  updateProperty: async () => false,
  deleteProperty: async () => false,
  addEnquiry: async () => false,
  updateEnquiryStatus: async () => false,
  adminLogin: async () => false,
  adminLogout: () => {},
});

// Helper to map MongoDB properties to frontend-compatible Property interface
const mapProperty = (p: any): Property => ({
  ...p,
  id: p._id, // Assign MongoDB _id as the id property for backward compatibility
});

const mapEnquiry = (e: any): MockEnquiry => ({
  ...e,
  id: e._id,
  date: e.createdAt ? e.createdAt.split('T')[0] : e.date || new Date().toISOString().split('T')[0],
});

const assignPropertyNumbers = (props: Property[]): Property[] => {
  const sorted = [...props].sort((a, b) => {
    const aNum = typeof a.id === 'number' ? a.id : parseInt(String(a.id), 10);
    const bNum = typeof b.id === 'number' ? b.id : parseInt(String(b.id), 10);
    const aIsSeed = !isNaN(aNum) && aNum < 1000;
    const bIsSeed = !isNaN(bNum) && bNum < 1000;
    if (aIsSeed && bIsSeed) return aNum - bNum;
    if (aIsSeed) return -1;
    if (bIsSeed) return 1;
    const aTime = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
    const bTime = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
    if (aTime && bTime) return aTime - bTime;
    return String(a.id).localeCompare(String(b.id));
  });

  return props.map((p, index) => {
    const indexInSorted = sorted.findIndex(item => item.id === p.id);
    const seq = indexInSorted !== -1 ? indexInSorted + 1 : index + 1;
    const padded = String(seq).padStart(3, '0');
    return {
      ...p,
      propertyNumber: `NSR-${padded}`
    };
  });
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<MockEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('newstar_admin_token');
  });
  
  const [adminUser, setAdminUser] = useState<AppContextValue['adminUser']>(() => {
    const user = localStorage.getItem('newstar_admin_user');
    return user ? JSON.parse(user) : null;
  });

  const isAdminLoggedIn = !!adminToken;

  // Add Axios Request Interceptor for Authentication
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (adminToken) {
          config.headers.Authorization = `Bearer ${adminToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [adminToken]);

  // Fetch properties (public or admin based on login state)
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      if (adminToken) {
        // Logged-in admin gets all properties (including draft/unpublished)
        const response = await axios.get('/api/properties/admin/all');
        if (response.data.success) {
          const raw = response.data.data.map(mapProperty);
          setProperties(assignPropertyNumbers(raw));
        }
      } else {
        // Public list gets only published properties
        const response = await axios.get('/api/properties?limit=100');
        if (response.data.success) {
          const raw = response.data.data.map(mapProperty);
          setProperties(assignPropertyNumbers(raw));
        }
      }
    } catch (error) {
      console.error('Error fetching properties, falling back to mock data:', error);
      // Fallback to mock data if backend is unavailable
      import('@/utils/constants').then(({ INITIAL_PROPERTIES }) => {
        const stored = localStorage.getItem('newstar_mock_properties');
        if (stored) {
          setProperties(assignPropertyNumbers(JSON.parse(stored)));
        } else {
          setProperties(assignPropertyNumbers([...INITIAL_PROPERTIES]));
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, [adminToken]);

  // Fetch enquiries (admin only)
  const fetchEnquiries = useCallback(async () => {
    if (!adminToken) {
      setEnquiries([]);
      return;
    }
    try {
      const response = await axios.get('/api/enquiries/admin/all');
      if (response.data.success) {
        setEnquiries(response.data.data.map(mapEnquiry));
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  }, [adminToken]);

  // Initial Data Fetch
  useEffect(() => {
    fetchProperties();
    fetchEnquiries();
  }, [fetchProperties, fetchEnquiries]);

  // Login handler
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('newstar_admin_token', token);
        localStorage.setItem('newstar_admin_user', JSON.stringify(user));
        
        // Let AppLayout / Form authentication wall know admin is authenticated
        localStorage.setItem('newstar_admin_logged_in', 'true');
        
        setAdminToken(token);
        setAdminUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed with backend, checking mock credentials:', error);
      // Fallback for when backend/MongoDB is not running
      if (email === 'admin@newstar.com' && password === 'admin123') {
        const token = 'mock_token_12345';
        const user = { id: '1', name: 'Admin', email: 'admin@newstar.com', role: 'admin' };
        localStorage.setItem('newstar_admin_token', token);
        localStorage.setItem('newstar_admin_user', JSON.stringify(user));
        localStorage.setItem('newstar_admin_logged_in', 'true');
        setAdminToken(token);
        setAdminUser(user);
        return true;
      }
      return false;
    }
  };

  // Logout handler
  const adminLogout = () => {
    localStorage.removeItem('newstar_admin_token');
    localStorage.removeItem('newstar_admin_user');
    localStorage.removeItem('newstar_admin_logged_in');
    setAdminToken(null);
    setAdminUser(null);
    setEnquiries([]);
  };

  // CRUD Operations: Properties
  const addProperty = async (newProp: Omit<Property, 'id'>): Promise<boolean> => {
    try {
      const response = await axios.post('/api/properties/admin/create', newProp);
      if (response.data.success) {
        await fetchProperties();
        return true;
      }
      console.error('Server responded without success:', response.data);
      return false;
    } catch (error: any) {
      console.error('Error adding property, using local state mock:', error);
      // Fallback for when backend/MongoDB is not running
      const mockId = Date.now().toString();
      const newMockProp = { ...newProp, id: mockId };
      setProperties(prev => {
        const nextProps = assignPropertyNumbers([...prev, newMockProp as Property]);
        localStorage.setItem('newstar_mock_properties', JSON.stringify(nextProps));
        return nextProps;
      });
      return true;
    }
  };

  const updateProperty = async (updatedProp: Property): Promise<boolean> => {
    try {
      const propId = updatedProp.id || (updatedProp as any)._id;
      const response = await axios.put(`/api/properties/admin/update/${propId}`, updatedProp);
      if (response.data.success) {
        await fetchProperties();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating property, using local state mock:', error);
      // Fallback for when backend/MongoDB is not running
      setProperties(prev => {
        const idx = prev.findIndex(p => p.id === updatedProp.id);
        if (idx !== -1) {
          const newProps = [...prev];
          newProps[idx] = updatedProp;
          const nextProps = assignPropertyNumbers(newProps);
          localStorage.setItem('newstar_mock_properties', JSON.stringify(nextProps));
          return nextProps;
        }
        return prev;
      });
      return true;
    }
  };

  const deleteProperty = async (id: number | string): Promise<boolean> => {
    try {
      const response = await axios.delete(`/api/properties/admin/delete/${id}`);
      if (response.data.success) {
        await fetchProperties();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting property, using local state mock:', error);
      // Fallback for when backend/MongoDB is not running
      setProperties(prev => {
        const nextProps = assignPropertyNumbers(prev.filter(p => p.id !== id));
        localStorage.setItem('newstar_mock_properties', JSON.stringify(nextProps));
        return nextProps;
      });
      return true;
    }
  };

  // CRUD Operations: Enquiries
  const addEnquiry = async (newEnquiry: Omit<MockEnquiry, 'id' | 'date' | 'status'>): Promise<boolean> => {
    try {
      const response = await axios.post('/api/enquiries', newEnquiry);
      if (response.data.success) {
        if (adminToken) {
          await fetchEnquiries();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding enquiry:', error);
      return false;
    }
  };

  const updateEnquiryStatus = async (id: number | string, status: 'New' | 'Contacted' | 'Closed'): Promise<boolean> => {
    try {
      const response = await axios.patch(`/api/enquiries/admin/status/${id}`, { status });
      if (response.data.success) {
        await fetchEnquiries();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isMobileMenuOpen,
        setMobileMenuOpen,
        properties,
        enquiries,
        isLoading,
        adminToken,
        adminUser,
        isAdminLoggedIn,
        addProperty,
        updateProperty,
        deleteProperty,
        addEnquiry,
        updateEnquiryStatus,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);