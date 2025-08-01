import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
const DateModal = ({ show, onClose, date, setDate, onAccept }) => {
    return (
        <Modal
            show={show}
            onHide={close}
            size="lg"
            centered
        >
            <Modal.Header>
                <Modal.Title>Select the start date for lead transfer.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-floating mb-3">
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        onChange={e => setDate(e.target.value)}
                        value={date || ''}
                    />
                    <label htmlFor="date" className="fw-normal">
                        Select Date
                    </label>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onAccept}>Add</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DateModal
