"use client";
import ViewportProvider from "@/providers/ViewportProvider";
import DeviceProvider from "@/providers/DeviceProvider";
import StaggerObserver from "@/providers/StaggerObserver";


interface ProvidersProps {
  readonly children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <StaggerObserver />
      {children}
      <ViewportProvider />
      <DeviceProvider />
    </>
  );
}