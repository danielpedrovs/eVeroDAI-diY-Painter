export const problems = {

  crack: {
    keywords: [
      "crack",
      "cracks",
      "cracking",
      "hairline",
      "split",
      "gap in the wall",
      "crack in the wall"
    ],

    intro: [
      "Cracks are really common, and many are easy to fix.",
      "Don't worry, many wall cracks are only cosmetic.",
      "That's a common one and often a straightforward repair."
    ],

    triage: {
      question:
        "Is it a thin hairline crack, or wider than about 3 mm?",

      options: {

        wide: {
          match: /wide|big|large|deep|bigger|getting worse|growing|3\s?mm/i,

          warning:
            "A wide crack that keeps growing can indicate movement in the building, so it's better to have it checked before filling it.",

          escalate: true
        },

        thin: {
          match: /hair|thin|small|tiny|minor|fine|hairline/i,

          materials: [
            "Flexible filler",
            "Putty knife",
            "120 grit sandpaper",
            "Primer",
            "Interior paint"
          ],

          steps: [
            "Open the crack slightly",
            "Clean out the dust",
            "Fill and smooth the crack",
            "Allow the filler to dry",
            "Sand the area smooth",
            "Apply primer",
            "Paint two coats"
          ]
        }
      }
    },

    followUps: {
      time:
        "A small crack usually takes around half a day, including drying time.",

      cost:
        "Fixing a single crack and repainting that wall is usually a small job. Give me the wall dimensions and I can estimate the cost."
    }
  },


  refresh: {
    keywords: [
      "refresh",
      "repaint",
      "freshen up",
      "new colour on the walls"
    ],

    intro: [
      "A repaint is a great way to freshen up a room."
    ],

    advice: {
      materials: [
        "Sugar soap",
        "Roller",
        "Paint tray",
        "Primer if needed",
        "Interior paint"
      ],

      steps: [
        "Clean the wall with sugar soap",
        "Let the wall dry",
        "Apply primer if the old colour is strong",
        "Apply the first coat",
        "Let it dry",
        "Apply the second coat"
      ]
    }
  },


  peeling: {
    keywords: [
      "peeling",
      "flaking",
      "bubbling",
      "blistering",
      "coming off the wall",
      "paint is lifting"
    ],

    intro: [
      "Peeling paint is usually caused by moisture or poor preparation.",
      "That's annoying, but it can normally be fixed properly."
    ],

    triage: {
      question:
        "Is it in a bathroom, kitchen or damp room, or somewhere dry like a bedroom?",

      options: {

        damp: {
          match: /bath|bathroom|kitchen|damp|wet|mould|mold|steam|shower/i,

          warning:
            "In damp rooms, it's important to find and fix the moisture source first, otherwise the paint may peel again.",

          materials: [
            "Scraper",
            "Mould treatment",
            "Stain-block primer",
            "Moisture-resistant paint"
          ],

          steps: [
            "Scrape off all loose paint",
            "Treat any mould",
            "Allow the surface to dry fully",
            "Apply primer",
            "Apply two coats of paint"
          ]
        },

        dry: {
          match: /bed|bedroom|living|hall|dry|lounge/i,

          materials: [
            "Scraper",
            "Sandpaper",
            "Primer",
            "Interior paint"
          ],

          steps: [
            "Scrape off loose paint",
            "Sand the edges smooth",
            "Clean the dust",
            "Apply primer",
            "Apply two coats of paint"
          ]
        }
      }
    }
  }
};