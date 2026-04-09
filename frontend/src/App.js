import Sidebar from "./components/Sidebar/Sidebar";

function App() {
    return ( <
        div style = {
            { display: "flex" } } >
        <
        Sidebar / >
        <
        div style = {
            { flex: 1 } } > Chat Area < /div> <
        /div>
    );
}

export default App;