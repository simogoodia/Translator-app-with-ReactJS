import React from "react";
import "./translatorApp.css";
import { countries } from "../../countries/countries.js";

class TranslatorApp extends React.Component {
    constructor(props) {
        super(props);
        this.reference = React.createRef();
        this.state = {
            fromVal: "",
            countries,
            country: null
        }
    }
    componentDidMount() {
        this.reference.current.focus();
        const twoSelect = document.querySelectorAll("select");
        twoSelect.forEach((select, idx) => {
            for(this.state.country in this.state.countries) {
                let selected;
                if(idx === 0 && this.state.countries[this.state.country] === "English") selected = "selected"
                else if(idx === 1 && this.state.countries[this.state.country] === "Arabic") selected = "selected";
                let option = `<option value="${this.state.country}" ${selected}>${this.state.countries[this.state.country]}</option>`;
                select.insertAdjacentHTML("beforeend", option);
            }
        });
    }
    valChange = ({ target }) => {
        this.setState({
            fromVal: target.value
        });
    }
    async getTranslate() {
        const twoSelect = document.querySelectorAll("select"),
            toText = document.getElementById("to-text");
        if(!this.state.fromVal === "" || this.state.fromVal) {
            let text = this.state.fromVal;
            let fromLang = twoSelect[0].value;
            let toLang = twoSelect[1].value;
            toText.value = "";
            toText.setAttribute("placeholder", "Translating...");
            let API_URL = await fetch(`https://api.mymemory.translated.net/get?q=${text}!&langpair=${fromLang}|${toLang}`);
            let results = await API_URL.json();
            toText.value = results.responseData.translatedText;
        } else {
            toText.value = "";
            toText.setAttribute("placeholder", "Translation");
        }
    }
    copyFromText = () => {
        navigator.clipboard.writeText(this.state.fromVal);
    }
    copyToText = () => {
        const toText = document.getElementById("to-text");
        navigator.clipboard.writeText(toText.value);
    }
    fromSound = () => {
        const fromSelect = document.querySelectorAll("select")[0];
        let synth = speechSynthesis;
        let utter = new SpeechSynthesisUtterance(this.state.fromVal);
        utter.lang = fromSelect.value;
        synth.speak(utter);
    }
    toSound = () => {
        const toSelect = document.querySelectorAll("select")[1],
            toText = document.getElementById("to-text");
        let synth = speechSynthesis;
        let utter = new SpeechSynthesisUtterance(toText.value);
        utter.lang = toSelect.value;
        synth.speak(utter);
    }
    changeValues = () => {
        const toText = document.getElementById("to-text");
        const fromSelect = document.querySelectorAll("select")[0],
            toSelect = document.querySelectorAll("select")[1];
        let tmpVal = this.state.fromVal;
        this.setState({
            fromVal: toText.value
        });
        toText.value = tmpVal;
        let tmpSelectVal = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = tmpSelectVal;
    }
    render() {
        return (
            <div className="translator-app">
                <div className="controls-gnr">
                    <div className="textarea">
                        <textarea id="from-text" className="from" placeholder="Write text" value={this.state.fromVal} onChange={this.valChange} ref={this.reference}></textarea>
                        <textarea id="to-text" className="to" placeholder="Translation" readOnly disabled></textarea>
                    </div>
                    <div className="controls">
                        <div className="from">
                            <div className="icons">
                                <i onClick={this.fromSound} className="fa-solid fa-volume-high"></i>
                                <i onClick={this.copyFromText} className="fa-solid fa-copy"></i>
                            </div>
                            <select></select>
                        </div>
                        <div className="exchange">
                            <i onClick={this.changeValues} className="fa-solid fa-right-left"></i>
                        </div>
                        <div className="to">
                            <select></select>
                            <div className="icons">
                                <i onClick={this.copyToText} className="fa-solid fa-copy"></i>
                                <i onClick={this.toSound} className="fa-solid fa-volume-high"></i>
                            </div>
                        </div>
                    </div>
                    <div className="btn">
                        <button onClick={ this.getTranslate.bind(this) }>Translate</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default TranslatorApp;
