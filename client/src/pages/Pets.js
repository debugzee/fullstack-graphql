import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const PETS_FIELDS = gql`
  fragment petsFields on Pet {
    img
    id
    name
    type
    vaccinated @client
    owner {
      id
      age @client
    }
  }
`;

const petQuery = gql`
  query fetchPets {
    pets {
      ...petsFields
    }
  }
  ${PETS_FIELDS}
`;

const petCreateMutation = gql`
  mutation createPet($input: NewPetInput!) {
    addPet(input: $input) {
      id
      name
      type
      img
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data, loading, error } = useQuery(petQuery);
  const [createPet, { createData, createLoading, createError }] = useMutation(
    petCreateMutation,
    {
      update(cache, { data: { addPet } }) {
        const { pets } = cache.readQuery({ query: petQuery });
        cache.writeQuery({
          query: petQuery,
          data: { pets: [addPet, ...pets] },
        });
      },
    }
  );

  if (loading) {
    return <Loader />;
  }
  if (error || createError) {
    return <div>{error}</div>;
  }

  console.log(data.pets[0]);
  const onSubmit = (input) => {
    setModal(false);
    createPet({
      variables: { input },
      optimisticResponse: {
        __typename: "Mutation",
        addPet: {
          __typename: "Pet",
          id: Math.round(Math.random() * -1000000) + "",
          type: input.type,
          name: input.name,
          img: "https://via.placeholder.com/300",
        },
      },
    });
  };

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>
          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data && data.pets ? data.pets : []} />
      </section>
    </div>
  );
}
