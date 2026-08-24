import PlanEditor from './components/PlanEditor/PlanEditor.tsx'
import DiffView from './components/DiffView/DiffView.tsx'

function App() {
  return (
    <>
      <PlanEditor />
      <DiffView />
    </>
  )
}

export default App

// In this repo, I want to have GET diff api which has 2 versions like 1, 2 manadtory fields in the request.
//   To find the diff, get both versions records from work_allocation tables in memory and do comparison.
//   Reponse structure shoud be mentioing what is added(row) / removed(row) / editted(row with field specific)

//   return both versions with rows in objects. third object should mention change per version
//   reponse example -
//   {
//   v1: [{row1}, {row2} ...],
//   v2: [{row1}, {row2} ...],
//   changes: {
//     v1: {add: {rowID5}, removed:{}, editted: {rowID3: {field1: {oldValue, newValue}, field2: {oldValue, newValue}}}},
//     v2: {add: {rowID5}, removed:{}, editted: {rowID3: {field1: {oldValue, newValue}, field2: {oldValue, newValue}}} }
//   }