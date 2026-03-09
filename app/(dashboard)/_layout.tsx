import React from 'react';
import { TouchableOpacity, Platform, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Custom Add Button Component for the center tab
const AddButton = ({ onPress }: { onPress?: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            top: -22,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        activeOpacity={0.9}
    >
        <View
            style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#0066CC',
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 8,
                shadowColor: '#0066CC',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
            }}
        >
            <Ionicons name="add" size={32} color="#fff" />
        </View>
    </TouchableOpacity>
);

export default function DashboardLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#0066CC',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 10,
                    backgroundColor: '#ffffff',
                    borderTopColor: '#f1f5f9',
                    borderTopWidth: 1,
                    height: Platform.OS === 'ios' ? 86 : 72,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                    paddingTop: 8,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '500',
                    marginTop: 3,
                },
                tabBarIconStyle: {
                    marginTop: 1,
                },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: 'Services',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="action"
                options={{
                    title: '',
                    tabBarIcon: () => null,
                    tabBarLabel: () => null,
                    tabBarButton: (props: any) => (
                        <AddButton onPress={props.onPress} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Sales',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile-pages"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="service-pages"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
