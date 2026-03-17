import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function ActionScreen() {
  const router = useRouter();

  useEffect(() => {
    router.push("/(dashboard)/services");
  }, [router]);

  return null;
}
