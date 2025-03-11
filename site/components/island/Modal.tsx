// defunct 

import { useContext, useState, createContext } from 'react';
import Profile from '../profile/Modal';

type SetValue = (value: any) => void;

type mapOpenInterface = {
  mapIsOpen: any;
  setMapIsOpen: SetValue;
};

type profileOpenInterface = {
  profileIsOpen: any;
  setProfileIsOpen: SetValue;
};


export const MapIsOpenContext = createContext<mapOpenInterface>(
  {
    mapIsOpen: false,
    setMapIsOpen: () => {}
  }
);

export const ProfileIsOpenContext = createContext<profileOpenInterface>(
  {
    profileIsOpen: false,
    setProfileIsOpen: () => {}
  }
); // this is really jank idk

export default function Island(){
    const { mapIsOpen, setMapIsOpen } = useContext(MapIsOpenContext)
    const { profileIsOpen, setProfileIsOpen } = useContext(ProfileIsOpenContext)
    return (
              <div className="absolute bottom-[5vh] z-20 flex items-center justify-center w-screen">
                <div className='bg-white p-3 text-xl rounded-full flex gap-3'>
                <MapIsOpenContext.Provider value = {{mapIsOpen: mapIsOpen, setMapIsOpen: setMapIsOpen }}>
                  <button className="rounded-full pl-2 pr-3 bg-hc-primary font-bold flex items-center text-white gap-1 hover:bg-white hover:text-hc-primary border-[3px] border-transparent hover:border-hc-primary transition" onClick={() => setMapIsOpen(true)}>
                    <img src="https://icons.hackclub.com/api/icons/white/compass" className="size-[32px]" alt="" />
                    Map
                  </button>
                  </MapIsOpenContext.Provider>
                  <ProfileIsOpenContext.Provider value = {{profileIsOpen: profileIsOpen, setProfileIsOpen: setProfileIsOpen }}>
                    <button className="rounded-full pl-2 pr-3 bg-hc-primary font-bold flex items-center text-white gap-1 hover:bg-white hover:text-hc-primary border-[3px] border-transparent hover:border-hc-primary transition" onClick={() => setProfileIsOpen(true)}>
                      <img src="https://icons.hackclub.com/api/icons/white/person" className="size-[32px]" alt="" />
                      My Profile
                    </button>
                  </ProfileIsOpenContext.Provider>
                </div>
              </div>
            
    )
}