import React from "react"
import PetData from "../lib/pet_data"
import { savePet } from "../lib/pet_utils"
import { usePetPeriodically } from "../lib/pet_hooks"
import { withTick } from "../lib/tick"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"

export const DebugInfo = withTick(({ frame, delta }) => {
  const pet = usePetPeriodically()

  return (
    <details>
      <summary>debug</summary>
      <div style={{ maxWidth: "100%", overflowX: "auto" }}>
        <Grid container>
          <Grid item xs={6}>
            <Action
              label="Reset Pet"
              onClick={() => {
                const newPet = new PetData({
                  name: pet.name,
                  sprite: "chicken-test",
                  background: "bg-1",
                })
                savePet(newPet, { sync: true })
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Action
              label="Reset Position"
              onClick={() => {
                const newPet = new PetData(pet)
                newPet.moveTo({ x: 0.05, y: 0.05 })
                savePet(newPet, { sync: true })
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Action
              label="Delete Pet"
              onClick={() => {
                savePet(null as any, { sync: true })
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Action
              label="Create dropping"
              onClick={() => {
                const newPet = new PetData(pet)
                newPet.createDropping()
                savePet(newPet, { sync: true })
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Action
              label="Empty Hunger"
              onClick={() => {
                const newPet = new PetData(pet)
                newPet.stats.hunger = 0
                savePet(newPet, { sync: true })
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Action
              label="Fill Hunger"
              onClick={() => {
                const newPet = new PetData(pet)
                newPet.stats.hunger = 1
                savePet(newPet, { sync: true })
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Action
              label="Empty Energy"
              onClick={() => {
                const newPet = new PetData(pet)
                newPet.stats.energy = 0
                savePet(newPet, { sync: true })
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Action
              label="Fill Energy"
              onClick={() => {
                const newPet = new PetData(pet)
                newPet.stats.energy = 1
                savePet(newPet, { sync: true })
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Action
              label="Empty Bladder"
              onClick={() => {
                const newPet = new PetData(pet)
                newPet.stats.bladder = 0
                savePet(newPet, { sync: true })
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Action
              label="Fill Bladder"
              onClick={() => {
                const newPet = new PetData(pet)
                newPet.stats.bladder = 1
                savePet(newPet, { sync: true })
              }}
            />
          </Grid>
        </Grid>

        {pet?.statKeys.map((k) => (
          <div key={k}>
            {k}: {(pet.timeEst[k] / 60 / 60).toFixed(2)}h
          </div>
        ))}

        <pre>
          <code>{JSON.stringify(pet?.toDebugJSON() ?? {}, undefined, 2)}</code>
        </pre>

        <pre>
          <code>{JSON.stringify({ frame, delta }, undefined, 1)}</code>
        </pre>
      </div>
    </details>
  )
})

const Action: React.FC<{ label: React.ReactNode; onClick: React.MouseEventHandler }> = ({
  label,
  onClick,
}) => {
  return (
    <Link
      href="#"
      component="a"
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
      }}
    >
      {label}
    </Link>
  )
}
