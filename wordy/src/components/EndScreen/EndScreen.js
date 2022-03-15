import { View, Text, StyleSheet, Pressable,Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors,colorsToEmoji } from '../../constants'
import  Clipboard from "@react-native-clipboard/clipboard";
import AsyncStorage from '@react-native-async-storage/async-storage'




const Number = ({number,label})=>(
    <View style={{alignItems:"center",margin:10}}>
        <Text style={{color:colors.lightgrey, fontSize:30, fontWeight:'bold'}} >{number}</Text>
        <Text style={{color:colors.lightgrey, fontSize:16 }} >{label}</Text>
    </View>
);





const EndScreen = ({won = false, rows, getCellBGColor}) => {
    const [secondsTillTommorrow,setSecondsTillTommorrow] = useState(0);
    const [played,setPlayed] = useState(0);
    const [winRate,setWinRate] = useState(0);
    const [curStreak,setCurStreak] = useState(0);
    const [maxStreak,setMaxStreak] = useState(0);

    useEffect(()=>{
        readState();
    },[]);

  

    const share = () => {
        const textMap = rows
          .map((row, i) =>
            row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
          )
          .filter((row) => row)
          .join("\n");
        const textToShare = `Wordel \n${textMap}`;
        Clipboard.setString(textToShare);
        Alert.alert("Copied successfully", "Share your score on you social media");
      };

    

    useEffect(()=>{
        const updateTime = ()=>{
            const now = new Date();
            const tommorrow = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );
            setSecondsTillTommorrow((tommorrow-now)/ 1000)
        };
        const interval = setInterval(updateTime,1000);
        return ()=> clearInterval(interval)

    },[]);

    const readState = async()=>{
        const dataString = await AsyncStorage.getItem("@game");
        let data;
        try{
          data = JSON.parse(dataString);
          console.log(data)
        }catch(e){
          console.log("Couldn't parse that state")
        }
        const keys = (Object.keys(data))
        const values = Object.values(data);

        setPlayed(keys.length)
        const numberOfWins = values.filter(game => game.gameState === 'won').length;
        setWinRate(Math.floor((100 * numberOfWins)/ keys.length)); 
        
        let _curStreak = 0;
        let maxStreak = 0;
        let prevDay = 0;
        keys.forEach((key)=>{
            const day = parseInt(key.split('-')[1]);
            console.log(day);
            if(data[key].gameState === 'won' && _curStreak === 0){
                _curStreak += 1
            }else if(data[key].gameState === 'won' && prevDay + 1 === day){
                _curStreak += 1
            }
            else{
                if(_curStreak > maxStreak){
                    maxStreak = _curStreak;
                }
                _curStreak = data[key].gameState === 'won'? 1 : 0;
            }
            prevDay = day
        });
        setCurStreak(_curStreak)
        setMaxStreak(maxStreak)

        
      }

    const formatSeconds = ()=>{
        const hours = Math.floor(secondsTillTommorrow / (60 * 60));
        const minutes = Math.floor(secondsTillTommorrow % (60*60) / 60);
        const seconds = Math.floor(secondsTillTommorrow % 60);
        return `${hours}:${minutes}:${seconds}`
    }
  return (
    <View style={{width:"100%",alignItems:"center"}} >
      <Text style={styles.title}>{won ? "Congratulations,you have  guessed that word" : "Try Again Tommorrow"}</Text>
      <Text style={styles.subTitle}>STATISTICS</Text>
      <View style={{flexDirection:'row', marginBottom:20}} >
      <Number number={played} label={'Played'} />
      <Number number={winRate} label={'Win %'} />
      <Number number={curStreak} label={'Cur Streak'} />
      <Number number={maxStreak} label={'Max Streak'} />
      </View>
      
    
     < View style={{flexDirection:"row",padding:10}} >
         <View style={{alignItems:"center", flex:1}}>
             <Text style={{color:colors.lightgrey}} >Next Wordy</Text>
             <Text style={{color:colors.lightgrey, fontSize:22, fontWeight:'bold'}} >{formatSeconds()}</Text>
         </View>
         <Pressable style={{flex:1, backgroundColor:colors.primary,borderRadius:25,alignItems:"center",justifyContent:"center"}} onPress={share} >
             <Text style={{color:colors.lightgrey,fontWeight:'bold'}}>Share</Text>
         </Pressable>
     </View>
    </View>
  )
}



const styles = StyleSheet.create({
    title:{
        fontSize:30, 
        color:'white',
        textAlign:"center",
        marginVertical:20
    },
    subTitle:{
        fontSize:25,
        color: colors.lightgrey,
        textAlign:"center",
        marginVertical:15,
        fontWeight: "bold"
    }
})

export default EndScreen