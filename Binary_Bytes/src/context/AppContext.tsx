import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Camera {
  id: string;
  name: string;
  ip: string;
  status: 'secure' | 'vulnerable' | string;
  risk: 'critical' | 'high' | 'medium' | 'low' | string;
  securityChecks: {
    strongPassword: boolean;
    encryption: boolean;
    authentication: boolean;
    firewall: boolean;
    firmware: boolean;
  };
}

interface Threat {
  id: string;
  timestamp: string;
  type: 'unauthorized_access' | 'brute_force' | 'anomaly' | 'intrusion';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  camera: string;
  description: string;
  status: 'active' | 'investigating' | 'resolved';
}

interface ScanResult {
  id: string;
  rtspUrl: string;
  vulnerabilities: string[];
  riskScore: number;
  status: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  findings: {
    weakPassword: boolean;
    openPorts: string[];
    outdatedFirmware: boolean;
    unencryptedStream: boolean;
    defaultCredentials: boolean;
  };
}

interface AppContextType {
  cameras: Camera[];
  setCameras: React.Dispatch<React.SetStateAction<Camera[]>>;
  threats: Threat[];
  scanResults: ScanResult[];
  addCamera: (camera: Camera) => void;
  updateCamera: (id: string, updates: Partial<Camera>) => void;
  addThreat: (threat: Threat) => void;
  updateThreat: (id: string, updates: Partial<Threat>) => void;
  addScanResult: (result: ScanResult) => void;
  stats: {
    totalCameras: number;
    vulnerableCameras: number;
    activeThreats: number;
    securedCameras: number;
  };
  totalCameras: number;
  vulnerableCameras: number;
  activeThreats: number;
  securedCameras: number;
  showNotification: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'warning'} | null>(null);

  // Initialize with default data
  useEffect(() => {
    const storedCameras = localStorage.getItem('cameras');
    const storedThreats = localStorage.getItem('threats');
    const storedScans = localStorage.getItem('scanResults');

    if (storedCameras) {
      setCameras(JSON.parse(storedCameras));
    } else {
      const defaultCameras: Camera[] = [
        {
          id: 'CAM-001',
          name: 'Entrance Camera',
          ip: '192.168.1.10',
          status: 'vulnerable',
          risk: 'critical',
          securityChecks: {
            strongPassword: false,
            encryption: false,
            authentication: false,
            firewall: false,
            firmware: false,
          }
        },
        {
          id: 'CAM-002',
          name: 'Lobby Camera',
          ip: '192.168.1.15',
          status: 'vulnerable',
          risk: 'high',
          securityChecks: {
            strongPassword: true,
            encryption: false,
            authentication: true,
            firewall: false,
            firmware: true,
          }
        },
        {
          id: 'CAM-003',
          name: 'Parking Camera',
          ip: '192.168.1.20',
          status: 'secure',
          risk: 'low',
          securityChecks: {
            strongPassword: true,
            encryption: true,
            authentication: true,
            firewall: true,
            firmware: true,
          }
        },
        {
          id: 'CAM-004',
          name: 'Warehouse Camera',
          ip: '192.168.1.25',
          status: 'secure',
          risk: 'low',
          securityChecks: {
            strongPassword: true,
            encryption: true,
            authentication: true,
            firewall: true,
            firmware: true,
          }
        },
      ];
      setCameras(defaultCameras);
      localStorage.setItem('cameras', JSON.stringify(defaultCameras));
    }

    if (storedThreats) {
      setThreats(JSON.parse(storedThreats));
    } else {
      const defaultThreats: Threat[] = [
        {
          id: 'THR-001',
          timestamp: new Date().toISOString(),
          type: 'unauthorized_access',
          severity: 'critical',
          source: '192.168.1.45',
          camera: 'CAM-001',
          description: 'Unauthorized login attempt detected from unknown IP',
          status: 'active'
        },
        {
          id: 'THR-002',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: 'brute_force',
          severity: 'high',
          source: '10.0.0.88',
          camera: 'CAM-002',
          description: 'Multiple failed authentication attempts (12 attempts in 2 minutes)',
          status: 'investigating'
        },
        {
          id: 'THR-003',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          type: 'anomaly',
          severity: 'medium',
          source: '192.168.1.102',
          camera: 'CAM-003',
          description: 'Unusual stream access pattern detected outside normal hours',
          status: 'investigating'
        },
      ];
      setThreats(defaultThreats);
      localStorage.setItem('threats', JSON.stringify(defaultThreats));
    }

    if (storedScans) {
      setScanResults(JSON.parse(storedScans));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (cameras.length > 0) {
      localStorage.setItem('cameras', JSON.stringify(cameras));
    }
  }, [cameras]);

  useEffect(() => {
    if (threats.length > 0) {
      localStorage.setItem('threats', JSON.stringify(threats));
    }
  }, [threats]);

  useEffect(() => {
    if (scanResults.length > 0) {
      localStorage.setItem('scanResults', JSON.stringify(scanResults));
    }
  }, [scanResults]);

  const addCamera = (camera: Camera) => {
    setCameras(prev => [...prev, camera]);
  };

  const updateCamera = (id: string, updates: Partial<Camera>) => {
    setCameras(prev => prev.map(cam => 
      cam.id === id ? { ...cam, ...updates } : cam
    ));
  };

  const addThreat = (threat: Threat) => {
    setThreats(prev => [threat, ...prev]);
  };

  const updateThreat = (id: string, updates: Partial<Threat>) => {
    setThreats(prev => prev.map(threat => 
      threat.id === id ? { ...threat, ...updates } : threat
    ));
  };

  const addScanResult = (result: ScanResult) => {
    setScanResults(prev => [result, ...prev]);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    // Listen for login attempts
    const handleLoginAttempt = (e: StorageEvent) => {
      if (e.key === 'login_attempt' && e.newValue) {
        const attempt = JSON.parse(e.newValue);
        showNotification(`Suspicious login attempt from ${attempt.ip} at ${new Date(attempt.timestamp).toLocaleString()}`, 'warning');
        localStorage.removeItem('login_attempt');
      }
    };

    // Listen for RTSP access attempts
    const handleRTSPAttempt = (e: StorageEvent) => {
      if (e.key === 'rtsp_access_attempt' && e.newValue) {
        const attempt = JSON.parse(e.newValue);
        showNotification(`Unauthorized RTSP access attempt from ${attempt.ip} at ${new Date(attempt.timestamp).toLocaleString()}`, 'error');
        localStorage.removeItem('rtsp_access_attempt');
      }
    };

    window.addEventListener('storage', handleLoginAttempt);
    window.addEventListener('storage', handleRTSPAttempt);

    return () => {
      window.removeEventListener('storage', handleLoginAttempt);
      window.removeEventListener('storage', handleRTSPAttempt);
    };
  }, []);

  const stats = {
    totalCameras: cameras.length,
    vulnerableCameras: cameras.filter(c => c.status === 'vulnerable').length,
    activeThreats: threats.filter(t => t.status === 'active').length,
    securedCameras: cameras.filter(c => c.status === 'secure').length,
  };

  return (
    <AppContext.Provider
      value={{
        cameras,
        setCameras,
        threats,
        scanResults,
        addCamera,
        updateCamera,
        addThreat,
        updateThreat,
        addScanResult,
        stats,
        totalCameras: cameras.length,
        vulnerableCameras: cameras.filter(cam => cam.status === 'vulnerable').length,
        activeThreats: threats.filter(t => t.status === 'active').length,
        securedCameras: cameras.filter(cam => cam.status === 'secure').length,
        showNotification,
      }}
    >
      {children}
      {notification && (
        <div 
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-500' : 
            notification.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          } text-white`}
          style={{
            transform: 'translateY(0)',
            opacity: 1,
            transition: 'all 0.3s ease-in-out',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <div className="flex items-center">
            <div className="shrink-0">
              {notification.type === 'success' ? '✅' : 
               notification.type === 'error' ? '❌' : '⚠️'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 -mr-1 p-1 rounded-md hover:bg-black/10 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn {
            from {
              transform: translateY(100px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `
      }} />
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
