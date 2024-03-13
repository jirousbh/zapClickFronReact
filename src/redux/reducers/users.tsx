interface UserState {
    email: string;
  }
  
  const INIT_STATE: UserState = {
    email: "",
  };
  
  export const usersReducer = (state = INIT_STATE, action: any) => {
    switch (action.type) {
      case "SET_USER_VIEW":
        return {
          ...state,
          email: action.payload,
        };
      default:
        return state;
    }
  };
  