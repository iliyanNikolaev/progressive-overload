
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './navigation/AppNavigator';
import { initializeDatabase } from './database/database';

export default function App() {
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    initializeDatabase();
    setDatabaseReady(true);
  }, []);

  if (!databaseReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
