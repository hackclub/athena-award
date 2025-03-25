import { createContext } from "react";

// the different points of interaction for the user, to manage the ui that should be visible based on this state
export type UXEvent = 'map' | 'profile' | 'landscape' | 'resources'

export type UXEventState = [UXEvent, (event: UXEvent) => void]

export const UXEventContext = createContext<UXEventState>(['map', () => {}]);