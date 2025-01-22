import { bootstrapCameraKit, CameraKitSession, Lens } from '@snap/camera-kit';
import { createContext, useEffect, useRef, useState } from 'react';
const apiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjg0ODMxMTQ0LCJzdWIiOiJlYTg4ZjQyZC0xYmM5LTRkN2YtYTMwMS02Y2M4YzU2OTg2Y2J-U1RBR0lOR340OGY1YjJmYS1iZGNjLTQ5MzAtYjI2NS1jNGYzODliMzAwYjAifQ.BojCwDCBLoh_7wsjjiM59vkpvdCDUyDd0WVMcFjcei0';
const lensGroupId = '6f94913f-d91d-4529-8779-f32b870bdb6a';

export interface CameraKitState {
  session: CameraKitSession;
  lenses: Lens[];
}

export const CameraKitContext = createContext<CameraKitState | null>(null);
export const CameraKit: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const isInitialized = useRef<boolean>(false);
    const [session, setSession] = useState<CameraKitSession | null>(null);
    const [lenses, setLenses] = useState<Lens[]>([]);
  
    useEffect(() => {
      const initializeCameraKit = async () => {
        const cameraKit = await bootstrapCameraKit({ apiToken });
        const session = await cameraKit.createSession();
        const { lenses } = await cameraKit.lensRepository.loadLensGroups([
          lensGroupId,
        ]);
  
        setLenses(lenses);
        setSession(session);
      };
  
      if (isInitialized.current) return;
      isInitialized.current = true;
  
      initializeCameraKit();
    }, []);
  
    return !session ? (
      <div >Initializing Camera Kit...</div>
    ) : (
      <CameraKitContext.Provider value={{ session, lenses }}>
        {children}
      </CameraKitContext.Provider>
    );
  };