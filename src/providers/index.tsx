"use client";
import ViewportProvider from "@/providers/ViewportProvider";
import DeviceProvider from "@/providers/DeviceProvider"; 


interface ProvidersProps {
  readonly children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <ViewportProvider />
      <DeviceProvider />
    </>
  );
}