// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ValAdemic {
    struct Diploma {
        string studentName;
        string studentId; // Matricula do aluno
        string institution;
        uint date;
        bytes32 diplomaHash;
    }

    mapping(bytes32 => Diploma) private diplomas;
    mapping(string => mapping(string => bool)) private studentInstitutionIds; // Verificar a existencia de um diploma por matricula e instituicao

    event DiplomaRegistered(bytes32 hash, string studentName, string institution, uint date, string studentId);

    function generateDiplomaHash(string memory studentName, string memory studentId, string memory institution, uint date) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(studentName, studentId, institution, date));
    }

    function registerDiploma(string memory studentName, string memory studentId, string memory institution, uint date) public returns (string memory, bytes32) {
        require(!studentInstitutionIds[studentId][institution], "Diploma ja existe para este ID de estudante nesta instituicao.");

        bytes32 diplomaHash = generateDiplomaHash(studentName, studentId, institution, date);
        diplomas[diplomaHash] = Diploma(studentName, studentId, institution, date, diplomaHash);
        studentInstitutionIds[studentId][institution] = true;
        emit DiplomaRegistered(diplomaHash, studentName, institution, date, studentId);
        return ("Diploma registrado com sucesso.", diplomaHash);
    }

    function getDiploma(bytes32 hash) public view returns (string memory, string memory, string memory, uint) {
        Diploma memory diploma = diplomas[hash];
        require(bytes(diploma.studentName).length != 0, "Diploma nao encontrado.");
        return (diploma.studentName, diploma.studentId, diploma.institution, diploma.date);
    }
}
