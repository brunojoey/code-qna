import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, Autocomplete } from 'react-materialize';
import snipsAPI from '../../utils/snipsAPI';
import './style.css';

function SearchForm(props) {
    const [options, setOptions] = useState({ data: {} });
    const [taglines, setTaglines] = useState([ { id: null, tagline: null } ]);
    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const { data } = await snipsAPI.getSnips();
            let options = { data: { }};
            let taglines = [];

            data.forEach(snip => { 
                options.data[snip.tagLine] = null; 
                taglines.push({ id: snip._id, tagline: snip.tagLine });
            });

            setOptions(options);
            setTaglines(taglines);
        }
        fetchData();

    }, []);

    function handleKeyDown(event) {
        if (event.key === 'Enter') { 
            const entered = event.target.value.toLowerCase();
            const tagline = taglines.find(obj => obj.tagline.toLowerCase() === entered);

            if (tagline) { setRedirect('/snips/' + tagline.id); }
            return;
        }
    }

    function handleClick(event) { 
        event.preventDefault();
        const tagline = taglines.find(obj => obj.tagline === event.target.value);

        if (tagline) { setRedirect('/snips/' + tagline.id); return; }
        if (options.data[tagline] === undefined) { event.target.value = ''; return; }
    }

    return (
        <>
            {(redirect !== null) ? <Redirect push to={redirect} /> : <></>}
            <Row>
                <Col s={12} m={8} offset='m2'>
                    <Autocomplete 
                        options={options}
                        placeholder="What's your question?"
                        style={{ width: '100%' }}
                        onClick={handleClick}
                        onKeyDown={handleKeyDown}
                    />
                </Col>
            </Row>
        </>
    );
};

export default SearchForm;
