import { Transition, Dialog } from '@headlessui/react';
import { useState } from 'react';
export default function DialogueButton({user, children}: {user: string, children: React.ReactNode}){
    const [ revealReply, setRevealReply ] = useState(false);
    return (
        <div>
            <div className = "flow-root my-2">
                <button className="float-right border-2 border-hc-primary/80 p-2 rounded-xl bg-hc-primary/80 text-white" onClick={() => setRevealReply(true)}>
                        {user}
                </button>
            </div>

        <div>
            <Transition
            show={revealReply}
            enter="transition duration-100 ease-out"
            enterFrom="scale-95"
            enterTo="scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0">
            { revealReply ? children : null }
            </Transition>
        </div>
    </div>
    )
}