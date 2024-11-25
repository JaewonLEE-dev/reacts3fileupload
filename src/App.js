import React, { useState } from "react";
import AWS from 'aws-sdk';

const S3_BUCKET = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_S3_REGION;

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESSKEY ,
  secretAccessKey: process.env.AWS_S3_SECRETKEY
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION
});

function App() {
  // 진행 상황 저장을 위한 변수
  const [progress, setProgress] = useState(0);
  // 선택된 파일 저장을 위한 변수
  const [selectedFile, setSelectedFile] = useState(null);

  // 파일을 선택했을 때 호출될 이벤트 핸들러
  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]); // 파일 상태 저장
  };

  // 실제 업로드 수행할 함수
  const uploadFile = (file) => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name
    };

    myBucket
     .putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100)); // 진행률 업데이트
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  return (
    <div>
      <div>Native SDK File Upload Progress is {progress}%</div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={() => uploadFile(selectedFile)}>
        Upload To S3
      </button>
    </div>
  );
}

export default App; 