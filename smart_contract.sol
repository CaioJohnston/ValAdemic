// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DiplomaRegistry {
    struct Diploma {
        uint id;
        string studentName;
        string course;
        string institution;
        uint date;
    }

    mapping(uint => Diploma) private diplomas;
    uint private nextId;

    event DiplomaRegistered(uint id, string studentName, string course, string institution, uint date);

    function registerDiploma(string memory studentName, string memory course, string memory institution, uint date) public {
        diplomas[nextId] = Diploma(nextId, studentName, course, institution, date);
        emit DiplomaRegistered(nextId, studentName, course, institution, date);
        nextId++;
    }

    function getDiploma(uint id) public view returns (uint, string memory, string memory, string memory, uint) {
        Diploma memory diploma = diplomas[id];
        return (diploma.id, diploma.studentName, diploma.course, diploma.institution, diploma.date);
    }
}
