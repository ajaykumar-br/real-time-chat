import CardContainer from "./components/CardContainer";


function App() {

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-3 gap-0">
        <CardContainer />
        <CardContainer />
        <CardContainer />
      </div>
    </div>
  );
}

export default App
