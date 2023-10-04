import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Power, PowerOff, AlignLeft } from 'lucide-react-native';

const CardActivity = ({
  icon,
  message,
  title,
  date,
}: {
  icon: React.ReactNode;
  message: string;
  title: string;
  date: string;
}) => {
  return (
    <View style={{ flex: 1, flexDirection: 'column', marginTop: 40, marginLeft: 10 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ borderWidth: 2, borderRadius: 50, height: 35, width: 35 }}>{icon}</View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={{ fontSize: 14, fontFamily: 'Inter', color: 'black' }}>{date}</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={{ fontFamily: 'Inter', fontSize: 24, fontWeight: '700', color: 'black' }}>{message}</Text>
      </View>
    </View>
  );
};

const ActivityScreen = () => {
  const cards = [
    {
      icon: <AlignLeft color="black" size={24} style={styles.Icon} />,
      message: 'Turn on a Zap to bring your activity feed to life!',
      title: 'Welcome!',
      date: 'Sep, 21',
    },
    {
      icon: <Power color="black" size={24} style={styles.Icon} />,
      message: 'If Every day at 10:15 PM, then Send an email at JohnDoe@gmail.com',
      title: 'Zapp turned on',
      date: 'Sep, 21',
    },
    {
      icon: <PowerOff color="black" size={24} style={styles.Icon} />,
      message: 'If Every day at 10:15 PM, then Send an email at JohnDoe@gmail.com',
      title: 'Zapp turned off',
      date: 'Sep, 21',
    },
  ];

  return (
    <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
      <ScrollView>
        {cards.reverse().map((card, index) => (
          <CardActivity key={index} icon={card.icon} message={card.message} title={card.title} date={card.date} />
        ))}
        <View style={{ height: 50 }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Icon: {
    color: 'black',
    marginTop: 5,
    marginLeft: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    color: 'black',
  },
  textContainer: {
    borderWidth: 2,
    borderColor: '#9C9C9C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 30,
    marginTop: 10,
  },
});

export default ActivityScreen;
