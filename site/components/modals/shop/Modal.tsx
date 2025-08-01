import Painting from "@/components/panels/Painting";
import Modal from "@/components/panels/layout/PopUpModal";
import useSWR from "swr";
import { multiFetcher } from "@/services/fetcher";
import { useContext } from "react";
import { UXEventContext } from "@/components/context/UXStages";
import { FaXmark } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { Tip } from "@/components/panels/add-ons/Callout";

export default function ShopModal() {
  const session = useSession();
  const { data, error, isLoading } = useSWR(
    ["/api/shop", `/api/user/my/artifacts`, "/api/user/my?query=verification", "/api/user/my?query=ordered_travel_stipend_money"],
    multiFetcher,
    { revalidateOnFocus: false }
  );
  const [uxEvent, setUXEvent] = useContext(UXEventContext);

  let shop, artifacts, verificationStatus, travelStipendMoney;
  if (data) {
    shop = data[0];
    artifacts = Math.floor(data[1]["message"]);
    verificationStatus = data[2]["result"]
    travelStipendMoney = data[3]["message"]
  }

  return (
    shop && (
      <Modal
        customHeader={{ icon: "bag-add", heading: "Shop" }}
        uxEventName="shop"
        uxEvent={uxEvent}
        setUXEvent={setUXEvent}
        className="overflow-auto"
        customHeaderContent={
          <div className="px-3 py-2 z-40 bg-cream/40 rounded-md text-white w-max">
            {artifacts}{" "}
            <img
              className="inline h-8"
              src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/44e7d5c7ff189dc439c2bea7483ade38630a1ca5_image.png"
            />
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <div>

            { verificationStatus != "verified_eligible" && 
              <Tip title = "Verification needed!">
                To get your prizes, we need to verify that you're someone who's {'<='} 18. Your ID will be kept secure.
                <br/>Once your ID is verified at <a target = "_blank" href = "https://identity.hackclub.com">identity.hackclub.com</a>, return here. Your order will be rejected if your ID is ineligible.
              </Tip> }

              <Tip title = "Travel stipends">
                  You've ordered ${travelStipendMoney} USD of travel stipends so far. See you at Parthenon!
              </Tip>

            <p>
              Click on a placard to order a prize with your approved artifacts!
            </p>
            <p>
              You can earn more artifacts by spending time on projects and
              getting them approved.
            </p>

            <p>Prize availability is always subject to change.</p>

            <div>
              <div className="my-2">
                <div
                  className={`p-6 my-2 flex flex-row flex-wrap relative h-full justify-center items-center`}
                >
                  {shop.map((prize: any, idx: number) => (
                    <div
                      key={idx + 1 + "_" + String(idx + 1) + "_painting"}
                      className={`sm:basis-1/2 md:basis-1/3 text-center my-10 z-50`}
                    >
                      <Painting
                        showCaptionOnSmall
                        index={idx + 1 + "_" + String(idx + 1) + "_painting"}
                        tooltip={prize.description}
                        className="inline"
                        key={idx}
                        image={prize.image}
                        description={prize.item_friendly_name}
                        descriptionBottom={` ${prize.item_name != "nyc_hackathon" && prize.item_name != "certification" ? `${prize.price} artifacts` : "3 projects + 30 hours"}`}
                        link={`https://forms.hackclub.com/athena-award-orders?item=${prize.item_name}`}
                      />
                      <span className="py-4 flex flex-row items-center justify-center gap-2">
                        {prize.availability}
                        {prize.availability_link && (
                          <a href={prize.availability_link} className="inline">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </a>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  );
}
