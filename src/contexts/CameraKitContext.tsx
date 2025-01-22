import { bootstrapCameraKit, CameraKitSession, Lens } from '@snap/camera-kit';
import { createContext, useEffect, useRef, useState } from 'react';
const apiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzM3Mzc5NDEzLCJzdWIiOiI4MGU5OGNhNS03ZGVlLTRiNmItYTliOC01Mzc2YzE5ZjYzYTJ-U1RBR0lOR34xYjhkYTJiMC0yODFmLTQyNGYtODU2Mi02NWIxZDA4ZDNiM2MifQ.bvka0G7TYEn9wcsQwP_8JlDQSf31l888c37q9LnKKsg';
const lensGroupId = '47c19dd5-984e-43ce-9048-b43a8535d2aa';

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