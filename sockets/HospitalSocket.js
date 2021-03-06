var hospitalList = [];

var addHospital = (socketId, hospitalId, name, lat, lng) => {
	var hospital = {socketId, hospitalId, name, lat, lng};
	hospitalList.push(hospital);
	return hospital;
}

var getHospitalBySocketId = (socketId) => {
	return hospitalList.filter((hospital) => hospital.socketId === socketId)[0];
}

var getHospitalByHospitalId = (hospitalId) => {
	return hospitalList.filter((hospital) => hospital.hospitalId === hospitalId)[0];
}

var removeHospital = (socketId) => {
	var hospital = getHospitalBySocketId(socketId);
	if (hospital) {
		hospitalList = hospitalList.filter((hospital) => hospital.socketId !== socketId);
	}
	return hospital;
}

var getOpenedHospitals = () => {
	return hospitalList;
}

var connect = (io) => {
	io.use((socket, next) => {
		let hospitalId = Number(socket.handshake.query.hospitalId);
		let name = socket.handshake.query.name;
		let lat = Number(socket.handshake.query.lat);
		let lng = Number(socket.handshake.query.lng);
		let hospital = getHospitalByHospitalId(hospitalId);
		if (hospital) {
			if (hospital.name === name) {
				let index = hospitalList.findIndex((hospital) => hospital.hospitalId === hospitalId)
				hospitalList[index].socketId = socket.id;
				console.log(`${name} [${hospitalId}] is reconnected`);
				return next();
			} else
				return next(new Error(`hospital id [${hospitalId}] and name does not match`))
		} else {
			addHospital(socket.id, hospitalId, name, lat, lng);
			console.log(`${name} [${hospitalId}] is connected`);
			return next();
		}
	});

	io.on('connection', (socket) => {
		socket.on('disconnect', () => {
			var hospital = removeHospital(socket.id);
			console.log(`${hospital.name} [${hospital.hospitalId}] is disconnected`);
		});

		socket.on('handshake', () => {
			// stub
		});
	});
};

module.exports = {connect, getOpenedHospitals, getHospitalByHospitalId}

