import useApiToken from "@/components/common/useApiToken";
import BASE_URL from "@/config/BaseUrl";
import {
  fetchButtonPermissionSuccess,
  fetchFailure,
  fetchPagePermissionSuccess,
} from "@/redux/slice/permissionSlice";
import axios from "axios";
import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth.user_type_id);
  const token = useApiToken();
  const allUsers = useSelector((store) => store.auth.allUsers);

  const fetchPagePermission = async () => {
    try {
      if (token) {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-usercontrol-new`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(
          fetchPagePermissionSuccess(
            JSON.stringify(response?.data?.pagePermissions)
          )
        );
      }
    } catch (error) {
      dispatch(fetchFailure());
    }
  };

  const fetchPermissions = async () => {
    try {
      if (token) {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-usercontrol`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(
          fetchButtonPermissionSuccess(
            JSON.stringify(response?.data?.buttonPermissions)
          )
        );
      }
    } catch (error) {
      dispatch(fetchFailure());
    }
  };
  const fetchYear = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-year`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data?.year?.current_year;
    } catch (error) {
      console.error(error);
    }
  };
  const getStaticUsers = () => {
    try {
      const users = allUsers;
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error parsing allUsers from Database", error);
      return [];
    }
  };

  useEffect(() => {
    if (token) {
      getStaticUsers();
      fetchPagePermission();
      fetchPermissions();
      fetchYear();
    }
  }, [token, dispatch]);

  return (
    <ContextPanel.Provider
      value={{
        userType,
        fetchPagePermission,
        getStaticUsers,
        fetchPermissions,
        fetchYear,
      }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
