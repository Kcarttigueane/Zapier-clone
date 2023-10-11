import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Heading } from '@gluestack-ui/themed';
import { PlusCircle } from 'lucide-react-native';

const CreateZapScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Heading style={styles.title}>Create a Zap</Heading>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '83%',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <TouchableOpacity style={[styles.bigButton, styles.shadow]}>
            <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>Trigger</Text>
            <TouchableOpacity style={styles.smallButton}>
              <Text style={styles.smallButtonText}>Add</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <PlusCircle size={40} style={{ borderWidth: 1, color: 'black' }} />
          <View style={styles.verticalLine} />
          <TouchableOpacity style={[styles.bigButton, styles.shadow]}>
            <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>Action</Text>
            <TouchableOpacity style={styles.smallButton}>
              <Text style={styles.smallButtonText}>Add</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateZapScreen;

const styles = StyleSheet.create({
  shadow: {
    elevation: 5,
    shadowColor: 'black',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    marginVertical: 40,
    fontSize: 32,
  },
  bigButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    height: 90,
    borderRadius: 10,
    backgroundColor: '#1F222A',
  },
  smallButton: {
    borderRadius: 50,
    backgroundColor: 'white',
  },
  smallButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  verticalLine: {
    width: 3,
    height: 30,
    backgroundColor: 'black',
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    height: 70,
    borderRadius: 50,
    backgroundColor: '#1F222A',
    elevation: 3,
    shadowColor: 'black',
  },
});
