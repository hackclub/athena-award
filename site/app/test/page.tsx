import CodeSnippet from "@/components/panels/add-ons/CodeSnippet";

export default function Page() {
  return (
    <div className="max-w-[70vw]">
<CodeSnippet status={true} snippet={`// Put your name and age in the code below and click "Run" to see what happens!
const name: string = 'INPUT_TEXT:NAME:END';
const age: number = 'INPUT_NUMBER:AGE:END';
const isAnAwesomeHackClubber = 'INPUT_BOOLEAN:HACK_CLUBBER:END';
console.log("My name is " + name + "!");
console.log("I am " + age + " years old.");
console.log("People have asked if I'm an awesome hack clubber, and to that I say it is " + isAnAwesomeHackClubber + " 😎");
`} template={`My name is NAME!
I am AGE years old.
People have asked if I'm an awesome hack clubber, and to that I say it is HACK_CLUBBER 😎`}/>
    </div>
  )
}