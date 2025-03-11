import { Dialog, } from "@headlessui/react";

export default function ProjectSubmissionModal({submitIsOpen, setSubmitIsOpen}: {submitIsOpen: boolean, setSubmitIsOpen: (value: any) => void}){
    return (
      <div className="m-2 sm:m-5">
      <Dialog open={submitIsOpen} onClose={() => setSubmitIsOpen(false)} className="h-[80vh] w-9/12 max-w-5xl transform overflow-auto rounded-xl text-left align-middle shadow-xl transition-all z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-hc-secondary p-10">
      <Dialog.Panel>
        <Dialog.Title>Submit Project</Dialog.Title>
        <p>Finished with your project? Submit it here for others to view in the Gallery!</p> {/* TO DO: high-seasesque wakatime project dropdown */}
        <form className = "my-8 sm:grid flex flex-col sm:grid-cols-2 gap-2 items-center justify-center" onSubmit={ () => { {console.log("submitted")} }}>
          <span className="col-span-1 flex flex-col">
            <label htmlFor="project_name">Project Name</label>
            <input type="text" id="project_name" name="project"/>
          </span>
          <span className = "col-span-1 flex flex-col">
            <label htmlFor="project_git">Project GitHub Repository</label>
            <input type="text" id="project_name" name="project"/>
          </span>
          <span className = "col-span-full flex flex-col">
            <label htmlFor="project_desc">Project Description</label>
            <input type="text" id="project_name" name="project"/>
          </span>
          <button type="submit" className="col-span-2 border rounded-lg bg-hc-primary/60 border-hc-primary/40 text-white p-2">Submit</button>
          </form>
        <button onClick={() => setSubmitIsOpen(false)}>Close</button>
      </Dialog.Panel>
    </Dialog>
    </div>
    )
  }