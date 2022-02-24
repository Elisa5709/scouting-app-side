import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Header,
  Button,
  Form,
  Container,
  Modal,
  Message,
  Label,
  Placeholder,
  Divider,
} from "semantic-ui-react";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import {
  colorOptions,
  driveTrainOptions,
  cvOptions,
  autoOptions,
  yesNoOptions,
} from "./AllOptions";

const MatchScout = () => {
  const [teamNumber, setTeamNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const [climb, setClimb] = useState("");
  const [shooter, setShooter] = useState("");

  const [eventKey, setEventKey] = useState("");
  const [matchKey, setMatchKey] = useState("");
  const [color, setColor] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showLookupError, setShowLookupError] = useState(false);

  const resetForm = () => {
    setEventKey("");
    setMatchKey("");
    setTeamName("");
    setColor("");
    setClimb("");
    setShooter("");
  };

  useEffect(() => {
    setShowSuccess(false);
    setShowError(false);
    setShowLookupError(false);
  }, [eventKey, matchKey, teamNumber]);

  const validate = () => {
    const requiredFields = [eventKey, matchKey];
    if (requiredFields.some((f) => f === "")) {
      setShowModal(true);
      return false;
    }
    return true;
  };

  const lookupTeam = async () => {
    const db = getFirestore();
    const docRef = doc(db, "teams", teamNumber);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { teamName, climb, shooter } = docSnap.data();
        setTeamName(teamName);
        setClimb(climb || "");
        setShooter(shooter || "");
      } else {
        setShowLookupError(true);
        resetForm();
      }
    } catch (e) {
      console.error(e);
      setShowLookupError(true);
    }
  };

  const save = async () => {
    if (!validate()) return;
    const db = getFirestore();
    try {
      const docRef = await addDoc(collection(db, "match"), {
        eventKey,
        matchKey,
        teamName,
        teamNumber,
        color,
      });
      console.log("Document written with ID: ", docRef.id);
      setShowSuccess(true);
      setTimeout(resetForm, 1500);
    } catch (e) {
      console.error("Error adding document: ", e);
      setShowError(true);
    }
  };

  return (
    <Container>
      <Header as="h1">Scout a match</Header>

      <Message attached header="Add Match data" />
      <Form>
        <Form.Group>
          <Form.Field>
            <label>Team Number</label>
            <input
              placeholder="Team Number"
              value={teamNumber}
              onChange={(e) => setTeamNumber(e.target.value)}
            />
          </Form.Field>
          <Form.Field style={{ alignSelf: "flex-end" }}>
            <Button color="blue" onClick={lookupTeam}>
              Lookup Team by number
            </Button>
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Team Name</label>
            {teamName && <Label>{teamName}</Label>}
            {teamName.length === 0 && (
              <Placeholder>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            )}
          </Form.Field>
          <Form.Field>
            <label>High Shooter</label>
            {shooter && <Label>{shooter}</Label>}
            {teamName.length === 0 && (
              <Placeholder>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            )}
          </Form.Field>
          <Form.Field>
            <label>High Climber</label>
            {climb && <Label>{climb}</Label>}
            {teamName.length === 0 && (
              <Placeholder>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            )}
          </Form.Field>
        </Form.Group>
        <Divider horizontal>
          <Header as="h4">Add Match data below</Header>
        </Divider>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Event Key</label>
            <input
              placeholder="Event Key"
              value={eventKey}
              onChange={(e) => setEventKey(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Match Key</label>
            <input
              placeholder="Match Key"
              value={matchKey}
              onChange={(e) => setMatchKey(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label style={{ color: "red" }}>Alliance Color *</label>
            <Form.Select
              options={colorOptions}
              placeholder="Alliance Color (required)"
              value={color}
              onChange={(e, data) => setColor(data.value)}
            />
          </Form.Field>
        </Form.Group>

        <Button type="submit" color="green" onClick={save}>
          Submit
        </Button>
      </Form>
      <div style={{ marginTop: 20, marginBottom: 30 }}>
        <Link to="/"> Back to Home</Link>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Some fields are blank</Modal.Header>
        <Modal.Content>
          <p>Please check some fields are not entered</p>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={() => setShowModal(false)}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
      {showSuccess && <Message success header="Data saved successfully" />}
      {showError && <Message negative header="Unable to save record" />}
      {showLookupError && (
        <Link to="/pitscout">
          <Message
            negative
            header="Team number not found, please add team first - Click Here"
          />
        </Link>
      )}
    </Container>
  );
};
export default MatchScout;
