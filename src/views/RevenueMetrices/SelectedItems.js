export default function (props) {

    const { selectedSEDisp } = props;
    return (
        <div className="col-md-12 customCard Scroll">
            {selectedSEDisp.length === 0 ? "None Selected" : selectedSEDisp}
            <div className="clearfix" style={{ height: '10px' }}></div>
        </div>
    );
}