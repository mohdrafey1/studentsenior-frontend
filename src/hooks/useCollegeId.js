import { useMemo } from 'react';

export const colleges = [
    { id: '66cb9952a9c088fc11800714', name: 'Integral University' },
    { id: '66cba84ce0e3a7e528642837', name: 'MPEC Kanpur' },
    { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
    { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
];

export const useCollegeId = (collegeName) => {
    return useMemo(() => {
        const selectedCollege = colleges.find(
            (college) =>
                college.name.toLowerCase().replace(/\s+/g, '-') === collegeName
        );
        return selectedCollege ? selectedCollege.id : null;
    }, [collegeName]);
};
