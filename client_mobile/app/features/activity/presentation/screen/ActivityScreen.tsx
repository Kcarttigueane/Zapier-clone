import { AlignLeft, Power, PowerOff } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import ActivityCard from '../components/ActityCard';

const ActivityScreen = () => {
  const cards = [
    {
      icon: <AlignLeft color="black" size={20} style={styles.icon} />,
      message: 'Turn on a Zap to bring your activity feed to life!',
      title: 'Welcome!',
      date: 'Sep, 21',
    },
    {
      icon: <Power color="green" size={20} style={styles.icon} />,
      message: 'If Every day at 10:15 PM, then Send an email at JohnDoe@gmail.com',
      title: 'Zapp turned on',
      date: 'Sep, 21',
    },
    {
      icon: <PowerOff color="red" size={20} style={styles.icon} />,
      message: 'If Every day at 10:15 PM, then Send an email at JohnDoe@gmail.com',
      title: 'Zapp turned off',
      date: 'Sep, 21',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {cards.reverse().map((card, index) => (
          <ActivityCard key={index} icon={card.icon} message={card.message} title={card.title} date={card.date} />
        ))}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityScreen;
