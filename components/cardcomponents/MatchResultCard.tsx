import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type MatchResultCardProps = {
  matchStatus: string;
  location: string;
  dateTime: string;
  team1Logo: string;
  team2Logo: string;
  team1finalScore: string;
  team2finalScore: string;
  team1Out: string;
  team2Out: string;
  team1Over: string;
  team2Over: string;
  finalresult: string;
  mTime: string;
};

const MatchResultCard: React.FC<MatchResultCardProps> = ({
  matchStatus,
  location,
  dateTime,
  team1Logo,
  team2Logo,
  team1finalScore,
  team2finalScore,
  team1Out,
  team2Out,
  team1Over,
  team2Over,
  finalresult,
  mTime,
}) => {
  return (
    <View style={styles.matchResultCard}>
      <View style={styles.matchTagWrap}>
        <Text style={styles.matchTagText}>{matchStatus}</Text>
      </View>
      <View style={styles.matchDetailWrap}>
        <Text style={styles.locationText}>{location}</Text>
        <Text style={styles.dateText}>{`${dateTime}, ${mTime}`}</Text>
      </View>
      <View style={styles.teamsWraps}>
        <View style={styles.teamBox}>
          <Image
            source={{ uri: `https://my.ispl.popopower.com/images/team-master/teams/${team1Logo}` }}
            style={styles.teamLogo}
            resizeMode="contain"
          />
        </View>
        <Image source={require('../../assets/images/vs.png')} style={styles.vsImage} resizeMode="contain" />
        <View style={styles.teamBox}>
          <Image
            source={{ uri: `https://my.ispl.popopower.com/images/team-master/teams/${team2Logo}` }}
            style={styles.teamLogo}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.matchScoringWrap}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>
            {team1finalScore}/{team1Out}
          </Text>
          <Text style={styles.overText}>{team1Over} OV</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>
            {team2finalScore}/{team2Out}
          </Text>
          <Text style={styles.overText}>{team2Over} OV</Text>
        </View>
      </View>
      <View style={styles.matchFinalResultBox}>
        <Text style={styles.finalResultText}>{finalresult}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  matchResultCard: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    paddingTop: 50,
    height: 320,
    width: 300,
    marginHorizontal: 10,
  },
  matchTagWrap: {
    position: 'absolute',
    backgroundColor: '#fbe29a',
    top: 0,
    left: 0,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderBottomRightRadius: 8,
  },
  matchTagText: {
    color: '#263574',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  matchDetailWrap: {
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10
  },
  locationText: {
    color: '#263574',
    fontSize: 20,
    fontWeight: '500',
  },
  dateText: {
    color: '#6c6c6c',
    fontSize: 16,
    fontWeight: '500',
  },
  teamsWraps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  teamBox: {
    height: 93,
    width: 93,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4764da',
    borderRadius: 100,
  },
  teamLogo: {
    width: 66,
    height: 66,
  },
  vsImage: {
    width: 30,
    height: 30,
  },
  matchScoringWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  scoreBox: {
    width: 93,
    textAlign: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: '#263574',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
  },
  overText: {
    color: '#6c6c6c',
    fontSize: 16,
    fontWeight: '600',
  },
  matchFinalResultBox: {
    padding: 10,
    backgroundColor: '#f5faff',
    justifyContent: 'center',
    alignItems: 'center',
    height: '15%',
  },
  finalResultText: {
    color: '#263574',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 26,
  },
});

export default MatchResultCard;
