import { ReactNode, createContext, useState } from "react";
import { TokenBurn } from "../types/migration";

export interface MigrationContextState {
  successfulBurns: TokenBurn[];
  setSuccessfulBurns: React.Dispatch<React.SetStateAction<TokenBurn[]>>;
}

const initialState: MigrationContextState = {
  successfulBurns: [],
  setSuccessfulBurns: () => {}
}

export const MigrationContext = createContext(initialState);

interface MigrationProvider{
  children: ReactNode;
}

export const MigrationProvider = ({children}: MigrationProvider) => {
  const [successfulBurns, setSuccessfulBurns] = useState<TokenBurn[]>([]);

  return (
    <MigrationContext.Provider value={{
      successfulBurns,
      setSuccessfulBurns
    }}>
      {children}
    </MigrationContext.Provider>
  )
}
