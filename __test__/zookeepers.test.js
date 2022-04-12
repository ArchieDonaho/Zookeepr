const fs = require('fs');
const { 
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper
 } = require('../lib/zookeepers.js')
const { zookeepers } = require('../data/zookeepers.json');

jest.mock('fs');

test("Creates new zookeeper object", () => {
    const zookeeper = createNewZookeeper({
        "id": "10",
        "name": "Carl",
        "age": 53,
        "favoriteAnimal": "dog"
      },
      zookeepers
      );

    expect(zookeeper.name).toBe('Carl');
    expect(zookeeper.age).toBe(53)
})

test('Filters by query', () => {
    const startingZookeepers =[ 
    {
        "id": "53",
        "name": "Emmy",
        "age": 29,
        "favoriteAnimal": "Duckbilled Platypus"
    },
    {
        "id": "19",
        "name": "Lernantino",
        "age": 19,
        "favoriteAnimal": "Business Cat"
    }];

    const updatedZookeepers = filterByQuery( { age: 29 }, startingZookeepers);
    expect(updatedZookeepers.length).toEqual(1)
})

test('Finds by id', () => {
    const startingZookeepers =[ 
    {
        "id": "53",
        "name": "Emmy",
        "age": 29,
        "favoriteAnimal": "Duckbilled Platypus"
    },
    {
        "id": "19",
        "name": "Lernantino",
        "age": 19,
        "favoriteAnimal": "Business Cat"
    }];

    const result = findById('19', startingZookeepers);
    expect(result.name).toBe('Lernantino')
})

test('Validates age', () => {
    const validZookeeper ={
            "id": "53",
            "name": "Emmy",
            "age": 29,
            "favoriteAnimal": "Duckbilled Platypus"
        };
    const invalidZookeeper ={
            "id": "19",
            "name": "Lernantino",
            "favoriteAnimal": "Business Cat"
        };   

    const result1 = validateZookeeper(validZookeeper);
    const result2 = validateZookeeper(invalidZookeeper);

    expect(result1).toBe(true);
    expect(result2).toBe(false);
})