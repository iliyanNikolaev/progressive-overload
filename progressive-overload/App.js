
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './navigation/AppNavigator';
import { initializeDatabase } from './database/database';

export default function App() {

  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
