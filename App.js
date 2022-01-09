import AuthProvider from './src/contexts/AuthProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider } from "react-redux";
import { store } from './src/store';

const App = () => {
    return (
        // Wrap the app inside a Provider which contains the redux store
        <Provider store={store}>
            {/* Make the user auth context available to the RootNavigator */}
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </Provider>

    );
}

export default App;