import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const petQuery = gql`
  query fetchPets {
    pets {
      img
      id
      name
      type
    }
  }
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

  if (loading || createLoading) {
    return <Loader />;
  }
  if (error || createError) {
    return <div>{error}</div>;
  }

  const onSubmit = (input) => {
    setModal(false);
    createPet({ variables: { input } });
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
