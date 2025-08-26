import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Define meeting dates - June 21st is set as a meeting day
  const meetingDates = [
    new Date(2024, 5, 21), // June 21, 2024 (month is 0-indexed, so 5 = June)
    new Date(2025, 5, 21), // June 21, 2025
    new Date(2026, 5, 21), // June 21, 2026
  ];

  // Define event date ranges
  const events = [
    {
      name: 'World Congress',
      startDate: new Date(2025, 10, 3), // November 3, 2025 (month is 0-indexed, so 10 = November)
      endDate: new Date(2025, 10, 8),   // November 8, 2025
      color: '#e74c3c', // Red color for World Congress
      type: 'congress'
    },
    {
      name: 'Natcon',
      startDate: new Date(2025, 11, 27), // December 27, 2025 (month is 0-indexed, so 11 = December)
      endDate: new Date(2025, 11, 29),   // December 29, 2025
      color: '#9b59b6', // Purple color for Natcon
      type: 'natcon'
    }
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isMeetingDay = (date) => {
    return meetingDates.some(meetingDate => 
      meetingDate.getDate() === date.getDate() &&
      meetingDate.getMonth() === date.getMonth() &&
      meetingDate.getFullYear() === date.getFullYear()
    );
  };

  const getEventForDate = (date) => {
    return events.find(event => {
      const eventDate = new Date(date);
      return eventDate >= event.startDate && eventDate <= event.endDate;
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = today.toDateString() === date.toDateString();
      const isMeeting = isMeetingDay(date);
      const event = getEventForDate(date);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isToday && styles.today,
            isMeeting && styles.meetingDay,
            event && { backgroundColor: event.color }
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isToday && styles.todayText,
            isMeeting && styles.meetingDayText,
            event && styles.eventDayText
          ]}>
            {day}
          </Text>
          {isMeeting && (
            <View style={styles.meetingIndicator}>
              <Ionicons name="people" size={8} color="#fff" />
            </View>
          )}
          {event && (
            <View style={styles.eventIndicator}>
              <Ionicons name="calendar" size={8} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>
      
      <View style={styles.calendarContainer}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Ionicons name="chevron-back" size={24} color="#1a73e8" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Ionicons name="chevron-forward" size={24} color="#1a73e8" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDaysContainer}>
          {dayNames.map(day => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysContainer}>
          {renderCalendarDays()}
        </View>
        
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ff6b35' }]} />
            <Text style={styles.legendText}>Meeting Day (June 21st)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
            <Text style={styles.legendText}>World Congress (Nov 3-8, 2025)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#9b59b6' }]} />
            <Text style={styles.legendText}>Natcon (Dec 27-29, 2025)</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  calendarContainer: {
    flex: 1,
    padding: 15,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    width: 40,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDay: {
    backgroundColor: '#1a73e8',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  today: {
    borderWidth: 1,
    borderColor: '#1a73e8',
    borderRadius: 20,
  },
  todayText: {
    color: '#1a73e8',
    fontWeight: 'bold',
  },
  meetingDay: {
    backgroundColor: '#ff6b35', // Orange color for meeting days
    borderRadius: 20,
  },
  meetingDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  meetingIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4285f4',
    borderRadius: 5,
    padding: 2,
  },
  legendContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  eventDayText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: '#4285f4',
    borderRadius: 5,
    padding: 2,
  },
}); 