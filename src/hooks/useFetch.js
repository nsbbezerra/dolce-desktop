import useSwr from "swr";
import api from "../configs/axios";
import { useEmployee } from "../context/Employee";

export default function useFetch(url) {
  const { employee } = useEmployee();
  const { data, error, mutate } = useSwr(
    [url],
    async (url) => {
      const response = await api.get(url, {
        headers: { "x-access-token": employee.token },
      });
      return response.data;
    },
    {
      revalidateOnReconnect: true,
      refreshInterval: 10000,
    }
  );

  return { data, error, mutate };
}
