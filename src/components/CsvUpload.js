import axios from 'axios';
import React, {useEffect,useState } from 'react'
import Papa from 'papaparse';
import { MaterialReactTable } from 'material-react-table';

export const CsvUpload = ()=>{

    const [columnsArray,setColumnsArray]=useState([]);
    const [valuesArray,setValuesArray]=useState([]);
    const [data,setData]=useState([]);
      // a local state to store the currently selected file.
  const [file, setFile] = React.useState(null);
  const handleSubmit = async(event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("file", file);
     // make a POST request to the File Upload API with the FormData object and Rapid API headers
     axios
     .post("http://localhost:8082/upload", formData, {
       headers: {
         "Content-Type": "multipart/form-data",
         "x-rapidapi-host": "file-upload8.p.rapidapi.com",
         "x-rapidapi-key": "your-rapidapi-key-here",
       },
     })
     .then((response) => {
       // handle the response
       console.log(response);
     })
     .catch((error) => {
       // handle errors
       console.log(error);
     });
  }

  const handleFileSelect = (event) => {
    setFile(event.target.files[0])
  }

    const handleFileUpload=(event)=>{
        Papa.parse(event.target.files[0],{
            header:"true",
            skipEmptyLines:true,
            complete:function(result){
                const columnArray=[];
                const valueArray=[];
                result.data.map((d)=>{
                    columnArray.push(Object.keys(d));
                    valueArray.push(Object.values(d));
                })
                setData(result.data);
                setColumnsArray(columnArray[0]);
                setValuesArray(valueArray)
            }
        });
    }
    return (
        <>
        {/* <form onSubmit={handleSubmit}>
        <input type='file' name='file' accept='.csv' onChange={handleFileSelect}/>
        <input type="submit" value="Upload File" />
        </form> */}
        <form onSubmit={handleSubmit}>
        <div className="row">
            <div class="col-6">
              <input type="file" className="form-control" placeholder="Upload you CSV" aria-label="Upload your CSV"
                name='file' accept='.csv' onChange={handleFileSelect}
              />
            </div>
            <div class="col-1">
              <button type="submit" className="btn btn-primary btn-md" aria-label="Upload">Upload</button>
            </div>
            </div>
        </form>

        </>
        
    );
  };