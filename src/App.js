import React from 'react';
import { Button, Form, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { generateImage } from './generate.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedImageURL: "http://192.168.0.6/16",
            uploaded: true, // 이 부분을 true로 변경
            fp16: 0,
            resize: "none",
            generationStatus: 0,
            updateGenerationProgressInterval: -1,
            bytesUsed: 0
        };
    }
    retakeImage = () => {
        this.setState({
            uploadedImageURL: "http://192.168.0.6/16"
        });
    }

    onUpload = (e) => {
        var input = e.target;
        var reader = new FileReader();
        reader.onload = () => {
            var dataURL = reader.result;
            this.setState({
                uploadedImageURL: dataURL,
                uploaded: true
            });
        };
        reader.readAsDataURL(input.files[0]);
    }

    generate = async () => {
        if (this.state.generationStatus !== 0) {
            return;
        }

        console.log(this.state);
        if (this.state.uploaded === false) {
            alert("Please upload an image.");
            return;
        }
        if (this.state.resize === "none") {
            alert("Please select a resize method.");
            return;
        }
        
        window.progress = 0;
        window.bytesUsed = 0;
        let updateGenerationProgressInterval = setInterval(() => {
            this.setState({
                generationProgress: window.progress * 100,
                bytesUsed: window.bytesUsed
            });

            if (this.state.generationStatus !== 1) {
                clearInterval(updateGenerationProgressInterval);
            }
        }, 500);


        this.setState({
            generationStatus: 1,
            updateGenerationProgressInterval: updateGenerationProgressInterval
        });
        let success = false;
        try {
            await generateImage(this.state.resize, this.state.fp16, "uploaded-image", "output");
            success = true;
        } catch (error) {
            alert("Error encountered while generating image: " + error);
            this.setState({
                generationStatus: 0
            });
        }

        if (success) {
            const canvas = document.getElementById("output");
            if (canvas) {
                const generatedImageURL = canvas.toDataURL();
                this.setState({
                    generationStatus: 2,
                    generatedImageURL: generatedImageURL
                });
            } else {
                console.error("Cannot find canvas element with ID 'output'");
            }
        }
    }
    
    componentWillUnmount = () => {
        if (this.state.updateGenerationProgressInterval !== -1) {
            clearInterval(this.state.updateGenerationProgressInterval);
        }
    }
    
    render () {
        return (
            <div className="app">
                <Container fluid>
                    <Row className="margin">
                        <Col/>
                        <Col xs="12">
                            <h1 style={{"marginBottom": "20px", textAlign: "center"}}>
                                W5100S-EVB Pico Animator: Am I the Star of the Animation? 
                                <a href="https://github.com/dbtjr1103/W5100S-EVB-PICO-Animator" style={{"fontSize": "12px"}}>View Source Code</a>
                            </h1>
                        </Col>
                        <Col/>
                    </Row>
                    <Row className="margin">
                        <Col/>
                        <Col xs="12" md="8" lg="6">
                            <Form>
                                <Form.File accept="image/*" label={(this.state.uploaded ? "Change the image" : "Upload an image")} onChange={this.onUpload} multiple={false} custom />
                            </Form>
                        </Col>
                        <Col/>
                    </Row>
                    <Row className="margin">
                        <Col />
                        <Col xs="12" md="4" lg="3" xl="3" style={{ textAlign: "center", margin: "20px" }}>
                            <img id="uploaded-image" alt="" src={this.state.uploadedImageURL} />
                        </Col>
                        <Col xs="12" md="4" lg="3" xl="3" style={{ textAlign: "center", margin: "20px" }}>
                            <canvas id="output"></canvas>
                        </Col>
                        <Col />
                    </Row>
                    <Row className="margin">
                        <Col/>
                        <Col xs="12" md="8" lg="6" style={{textAlign: "center"}}>
                            <Form>
                                <Form.Group controlId="resize">
                                    <Form.Control defaultValue="none" as="select" onChange={(e) => this.setState({resize: e.target.value})}>
                                        <option value="none" disabled>Select Generated Image Size</option>
                                        <option value="s">Small (Fast)</option>
                                        <option value="m">Medium</option>
                                        <option value="l">Large (Slow)</option>
                                        <option value="original">Do Not Resize (Likely to break if the image is too large)</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="fp16">
                                    <Form.Control as="select" onChange={(e) => this.setState({fp16: parseInt(e.target.value)})}>
                                        <option value="0">Force FP16 For Speed (Lower Quality): No</option>
                                        <option value="1">Force FP16 For Speed (Lower Quality): Yes</option>
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" onClick={this.generate}>Generate</Button>
                            </Form>
                        </Col>
                        <Col/>
                    </Row>
                    <Row className="margin" style={{"display": this.state.generationStatus === 1 ? "block" : "none"}}>
                        <Col/>
                        <Col xs="12" md="8" lg="6" style={{textAlign: "center"}}>
                            <ProgressBar now={this.state.generationProgress} style={{"margin": "10px"}} />
                            <p>Generating image...</p>
                            <p>This may take 15 to 30 seconds depending on your device.</p>
                            <p>Memory usage (MB): {this.state.bytesUsed / 1000000} </p>
                        </Col>
                        <Col/>
                    </Row>
                    
                </Container>
            </div>
        );
    }
}

export default App;
