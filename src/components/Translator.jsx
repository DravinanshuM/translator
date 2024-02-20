import React, { useState } from 'react';
import './style.css';
import Countries from './Contries.js';
import axios from 'axios';

const Translator = () => {
    const [sourceLanguage, setSourceLanguage] = useState("en-US");
    const [targetedLanguage, setTargetedlanguage] = useState("hi-IN");
    const [status, setStatus] = useState(false);
    const [text, setText] = useState('');
    const [textGet, setTextGet] = useState('');

    // function for source.
    const handleSourceLanguageChange = (e) => {
        console.log(e.target.value);
        setSourceLanguage(e.target.value);
    }

    // function for targeted language.
    const handleTargetlanguageChange = (e) => {
        console.log(e.target.value);
        setTargetedlanguage(e.target.value);
    }

    // function for translation.
    const TranslationFunction = async() => {
        try {
            const result = await axios.get(`https://api.mymemory.translated.net/get?q=${text}&langpair=${sourceLanguage}|${targetedLanguage}`);
            console.log(result.data);
            // console.log(result.data.responseData.translatedText);
            const translationText = result.data.responseData.translatedText;
            if(!translationText || translationText.trim() === "NO QUERY SPECIFIED. EXAMPLE REQUEST: GET?Q=HELLO&LANGPAIR=EN|IT") {
                setTextGet("");
                return;
            }
            if(!translationText  || translationText === "QUERY LENGTH LIMIT EXCEEDED. MAX ALLOWED QUERY : 500 CHARS") {
                setTextGet("");
                showMessage("The text length should not exceed 500 characters.");
                return;
            }

            setTextGet(translationText);
            setStatus(true);
        } catch (error) {
            console.log("ERROR :: ", error.message);
        }
    }

    //  when click then call the function.
    const handleClick = () => {
        TranslationFunction();
    }

    // show message function call.
    const showMessage = (message) => {
        const elementMessage = document.createElement('div');
        elementMessage.textContent = message; 
        elementMessage.classList.add('message-class'); 
        document.body.appendChild(elementMessage); 
        console.log("call :: ", message);

        setTimeout(()=>{
            document.body.removeChild(elementMessage);
        }, 2000);
    }
    

    // for copy the textArea data.
    const Copy = (e) => {

        const dataAttr = e.target.getAttribute('data-item');
        if (text.trim() !== "" && dataAttr === "1") {
            navigator.clipboard.writeText(text);
            // console.log("copy");
            showMessage("Translation copied")
        } else if(textGet.trim() !== "" && dataAttr === "2") {
            navigator.clipboard.writeText(textGet);
            // console.log("copy");
            showMessage("Translation copied")
        } else {
            // console.log("there is no data");
            showMessage("There is no Text")
        }
    }

    // for Listning.
    const Voice = (e) => {
        // console.log("voice");
        const dataAttr = e.target.getAttribute('data-voice');
        console.log(dataAttr);

        if(text !=="" && dataAttr === "1") {
            Speak(text, sourceLanguage);
        } else if(textGet !== "" && dataAttr === "2") {
            Speak(textGet, targetedLanguage);
        } else {
            if(dataAttr === "1") {
                Speak("please Enter Some text", sourceLanguage);
            } else if (dataAttr === "2") {
                Speak("please Enter Some text", targetedLanguage);
            }
        }
    }

    // for speak method.
    const Speak = (message, language) => {
            // console.log("speak"); 
        if(message && language) {
            let speechSynthesis = window.speechSynthesis;
            let utterance = new SpeechSynthesisUtterance();
            utterance.text = message;
            utterance.lang = language;
            speechSynthesis.speak(utterance);
        }
    }

    // for Translated By Voice.
    const TranslatedByVoice = async () => {
        console.log("voice");
        // Check if browser supports Web Speech API
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            console.error("Web Speech API not supported in this browser");
            showMessage("Web Speech API not supported in this browser");
            return;
        }
    
        let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
        try {
            let recognition = new speechRecognition();
            console.log(recognition);
            recognition.lang = sourceLanguage;
            recognition.interimResults = true;
            recognition.start();
            Speak("Speak", sourceLanguage);
    
            recognition.onresult = (event) => {
                let Transscript = event.results[0][0].transcript;
                console.log(Transscript);
                setText(Transscript);
            };
    
            recognition.onerror = (event) => {
                console.error("Recognition error:", event.error);
                // Handle error gracefully
            };

            document.getElementById("FromId").setAttribute("placeholder", "Speak Now");
            const listenIcon = document.getElementById('listen-icon');
            console.log(listenIcon);
            if(listenIcon) {
                listenIcon.className = '';
                listenIcon.classList="mx-2 text-secondary first-icon fa-solid fa-circle-stop";
            }

            recognition.onend = (event) => {
                console.log("Recognition ended");
                showMessage("Ended listing.");
                document.getElementById("FromId").setAttribute("placeholder", "Enter The Text");
                listenIcon.classList = "bi bi-mic-fill mx-2 text-secondary first-icon";
                // Optionally, restart recognition
                // recognition.start();
            };
        } catch (error) {
            console.error("ERROR :: ", error.message);
        }
    }
    
 
    // for swap.
    const Swap =() => {
        console.log("swap");
        // swap select first.
        setSourceLanguage(targetedLanguage);
        setTargetedlanguage(sourceLanguage);
        // swap textArea.
        setText(textGet);
        setTextGet(text);
    }


  return (
     <>
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-12 text-center text-white mb-4'>
                    <h1 className=''>MAA SHARDA TRANSLATOR <span className="badge bg-secondary">MAA</span></h1>
                    <p>Updated version: 2.0</p>
                </div>
                <div className='col-lg-12 col-md-12 col-12 mb-3 bg-white shadow p-5 border rounded'>
                    <div className='row align-items-center justify-content-center'>
                        <div className='col-lg-5 col-md-5 col-12 mb-3'>
                            <select className="form-select mb-2 shadow-none" aria-label="Select source language" value={sourceLanguage} onChange={handleSourceLanguageChange}>
                                {
                                    Object.entries(Countries).map(([code, language])=> (
                                        <option key={code} value={code}>{language}</option>
                                    ))
                                }
                            </select>
                            <textarea className='form-control fs-5 shadow-none teaxtFiled' rows="5" id='FromId' placeholder='Enter The Text' value={text} onChange={(e)=>setText(e.target.value)}></textarea>
                            <i className="fa-solid fa-copy mx-2 text-secondary first-icon" onClick={Copy} data-item="1" title='copy translation'></i>
                            <i className="fa-solid fa-volume-high mx-2 text-secondary first-icon" onClick={Voice} data-voice="1" title='listen'></i>
                            <i className="bi bi-mic-fill mx-2 text-secondary first-icon" onClick={TranslatedByVoice} title='translate by voice' id='listen-icon'></i>
                        </div>
                        <div className='d-grid col-lg-1 col-md-1 col-12 mb-3 text-center'>
                            <button type="button" className="btn btn-primary">
                                <i className="bi bi-arrow-left-right" onClick={Swap}></i>
                            </button>
                        </div>
                        <div className='col-lg-5 col-md-5 col-12 mb-3'>
                            <select className="form-select mb-2 shadow-none" aria-label="Select target language" value={targetedLanguage} onChange={handleTargetlanguageChange}>
                                {
                                    Object.entries(Countries).map(([code, language])=> (
                                        <option key={code} value={code}>{language}</option>
                                    ))
                                }
                            </select>
                            <textarea className='form-control fs-5 shadow-none' rows="5" placeholder='Translation' value={textGet} disabled={status} readOnly></textarea>
                            <i className="fa-solid fa-copy mx-2 text-secondary first-icon" onClick={Copy} data-item="2" title='copy translation'></i>
                            <i className="fa-solid fa-volume-high mx-2 text-secondary first-icon" onClick={Voice} data-voice="2" title='listen'></i>
                        </div>  
                    </div>
                    <div className='row justify-content-center mt-4'>
                        <div className='col-lg-3 col-md-3 col-12 mb-3 text-center'>
                            <button type="button" className="btn btn-primary w-100" onClick={handleClick}>
                                Translate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     </>
  )
}

export default Translator;