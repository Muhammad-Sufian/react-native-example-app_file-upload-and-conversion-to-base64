import React from "react";
import { View, StyleSheet, TextInput, Text, Platform, TouchableOpacity } from "react-native";

import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'

class ConvertingFileToBase64 extends React.Component {
  state = {
    picked_file_name: '',
  }

  selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      var res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], 
      });
      console.log(res)
      res = res[0]
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
      this.setState({ picked_file_name: res.name })

      let data = ''
      RNFetchBlob.fs.readStream(
        // file path
        res.uri,
        // encoding, should be one of `base64`, `utf8`, `ascii`
        'base64',
        // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
        // when reading file in BASE64 encoding, buffer size must be multiples of 3.
        4095)
        .then((ifstream) => {
          ifstream.open()
          ifstream.onData((chunk) => {
            // when encoding is `ascii`, chunk will be an array contains numbers
            // otherwise it will be a string
            data += chunk
          })
          ifstream.onError((err) => {
            console.log('oops', err)
          })
          ifstream.onEnd(() => {
            // console.log('data:image/png,base64' + data)
          })
        })


    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        console.log('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };



  sendingFileToServer=async()=>{
    //Opening Document Picker for selection of one file
    try {
      var res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], 
      });
      
      res = res[0]
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
      this.setState({ picked_file_name: res.name })

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "multipart/form-data"); 
      
      var formdata = new FormData();
      formdata.append("photo", res);
      console.log(formdata)
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      
      fetch("some base url", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));


    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        console.log('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  render() {

    return (
      <View style={{ width: '100%', alignSelf: 'center' }}>


        <TouchableOpacity onPress={() => this.selectOneFile()} style={{ height: 100, width: '100%', backgroundColor: '#D7D7D7', justifyContent: 'center', marginBottom: 30 }}>
          <Text style={{ alignSelf: 'center' }}>Pick a file</Text>
        </TouchableOpacity>

        <Text>{this.state.picked_file_name}</Text>


        <TouchableOpacity onPress={() => this.sendingFileToServer()} style={{ height: 100, width: '100%', backgroundColor: '#D7D7D7', justifyContent: 'center', marginBottom: 30, marginTop: 30 }}>
          <Text style={{ alignSelf: 'center' }}>Upload a file</Text>
        </TouchableOpacity>

        

      </View>
    );
  }
};

 

export default ConvertingFileToBase64;