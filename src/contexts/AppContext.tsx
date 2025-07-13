import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { getToken } from '../utils/storage';
import moment from 'moment';
import { removeToken } from '../utils/storage';

interface Student {
  _id: string;
  studentName: string;
  room: string;
  shift: string;
  seatNo: string;
  phone: string;
  dueDate: string;
  fatherName: string;
  idProof: string;
  localAdd: string;
  permanentAdd: string;
  amount: number;
  duration: number;
  image?: string;
  idUpload?: string;
}

interface AttendanceRecord {
  _id: string;
  student: Student;
  date: string;
}

interface Seat {
  _id: string;
  room: string;
  shift: string;
  seatNo: string;
  status: string;
}

interface AdminProfile {
    _id: string;
  libraryName: string;
  libraryAddress: string;
  name: string;
  email: string;
  phone: string;
  subscription: {
    active: boolean;
    expiresAt: string;
    plan: string;
  };
  // Add other admin fields if needed
}

interface AppContextType {
  students: Student[];
  attendance: AttendanceRecord[];
  loading: boolean;
  error: string | null;

  // New state for Welcome screen
  adminProfile: AdminProfile | null;
  seats: Seat[];
  availableRooms: string[];
  availableShifts: string[];
  totalStudents: number;
  totalIncome: number;

  fetchStudents: () => Promise<void>;
  fetchAttendance: (date: Date) => Promise<void>;

  // New functions for Welcome screen
  fetchAdminProfile: () => Promise<void>;
  fetchAllSeats: () => Promise<void>;
  fetchWelcomeData: () => Promise<void>; // Combined fetch for initial load
}

const AppContext = createContext<AppContextType & { logout: () => void } | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [availableShifts, setAvailableShifts] = useState<string[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  const logout = async () => {
    await removeToken();
  };

  // Add these functions to your AppProvider
  const fetchAdminProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await axios.get(
        'https://softbook-backend.onrender.com/api/v1/admin/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAdminProfile(response.data.admin);
    } catch (err) {
      setError('Failed to fetch admin profile');
      console.error('Error fetching admin profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminProfile?.subscription?.active === false) {
      logout();
    }
  }, [adminProfile]);

  // Update totalStudents whenever students array changes
  useEffect(() => {
    setTotalStudents(students.length);
  }, [students]);

  // Update totalIncome whenever students array changes
  useEffect(() => {
    const total = students.reduce((sum, student) => sum + (student.amount || 0), 0);
    setTotalIncome(total);
  }, [students]);

  const fetchAllSeats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await axios.get(
        'https://softbook-backend.onrender.com/api/v1/seat/allseats',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const seatsData = response.data.seats;
      setSeats(seatsData);

      // Extract unique rooms and shifts
      const roomSet = new Set<string>();
      const shiftSet = new Set<string>();
      seatsData.forEach((seat: Seat) => {
        roomSet.add(seat.room);
        shiftSet.add(seat.shift);
      });

      setAvailableRooms(Array.from(roomSet));
      setAvailableShifts(Array.from(shiftSet));
    } catch (err) {
      setError('Failed to fetch seats');
      console.error('Error fetching seats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Combined function for initial Welcome screen load
  const fetchWelcomeData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAdminProfile(),
        fetchAllSeats(),
        fetchStudents(), // This will automatically update totalStudents
      ]);
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await axios.get(
        'https://softbook-backend.onrender.com/api/v1/students/allstudents',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setStudents(response.data.students);
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance for specific date
  const fetchAttendance = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const response = await axios.get(
        `https://softbook-backend.onrender.com/api/v1/attendance/admin?date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAttendance(response.data.attendance);
    } catch (err) {
      setError('Failed to fetch attendance');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        // Existing values
        students,
        attendance,
        loading,
        error,
        fetchStudents,
        fetchAttendance,

        // New values
        adminProfile,
        seats,
        availableRooms,
        availableShifts,
        totalStudents,
        totalIncome,
        fetchAdminProfile,
        fetchAllSeats,
        fetchWelcomeData,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
