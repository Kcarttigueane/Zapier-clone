import { AddIcon, GlobeIcon, GripVerticalIcon, Icon, MenuIcon, SettingsIcon } from '@gluestack-ui/themed';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomBottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const getIcon = (routeName: string, color: string): ReactNode => {
    switch (routeName) {
      case 'Home':
        return <Icon as={GlobeIcon} size="xl" style={{ color }} />;
      case 'Activity':
        return <Icon as={MenuIcon} size="xl" style={{ color }} />;
      case 'Zap':
        return (
          <View
            style={{
              marginBottom: 35,
              backgroundColor: '#613EEA',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              width: 70,
              elevation: 5,
              height: 70,
            }}>
            <View
              style={{
                borderColor: 'white',
                backgroundColor: '#643EEA',
                borderRadius: 50,
                borderWidth: 3,
              }}>
              <Icon as={AddIcon} size="xl" style={{ color: '#FFF' }} />
            </View>
          </View>
        );
      case 'Services':
        return <Icon as={GripVerticalIcon} size="xl" style={{ color }} />;
      case 'Settings':
        return <Icon as={SettingsIcon} size="xl" style={{ color }} />;
      default:
        return <Icon as={GlobeIcon} size="xl" style={{ color }} />;
    }
  };

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;

        const color = isFocused ? 'blue' : 'grey';

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={index} onPress={onPress} style={styles.tab}>
            {getIcon(route.name, color)}
            {isFocused && route.name !== 'Zap' && <Text style={{ color }}>{label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: 'FFF',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomBottomTabBar;
