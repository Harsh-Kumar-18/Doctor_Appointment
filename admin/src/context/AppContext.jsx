import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // ✅ Proper date format
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[dateArray[1] - 1]} ${dateArray[2]}`;
  };

  const calculateAge = (dob) => {
    const today = new Date()
    const birstDate = new Date(dob)

    let age = today.getFullYear() - birstDate.getFullYear()
    return age
  }
  const value = {
    calculateAge,
    slotDateFormat
  }
  return (
    <AppContext.Provider value={value}>
      {
        props.children
      }
    </AppContext.Provider>
  )
}

export default AppContextProvider;