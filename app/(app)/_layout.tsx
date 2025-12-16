import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from "../../components/CustomDrawerContent"; // Vamos criar isso já já

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Vamos deixar o header ser controlado pelas Tabs
        drawerActiveTintColor: '#007AFF',
      }}
    >
      {/* O nome aqui deve bater com a pasta das tabs */}
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          drawerLabel: 'Início',
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />
        }} 
      />

      {/* Escondemos telas que não devem aparecer no menu, mas são acessíveis */}
      <Drawer.Screen 
        name="edit/[id]" 
        options={{ 
          drawerItemStyle: { display: 'none' } 
        }} 
      />
      <Drawer.Screen 
        name="details/[id]" 
        options={{ 
          drawerItemStyle: { display: 'none' } 
        }} 
      />
    </Drawer>
  );
}